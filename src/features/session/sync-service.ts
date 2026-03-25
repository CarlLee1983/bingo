import { Peer, DataConnection } from 'peerjs';
import { SessionState } from './session-types';

/**
 * Handles real-time synchronization using WebRTC (via PeerJS).
 */
export class SyncService {
  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private onDataReceived: ((data: SessionState) => void) | null = null;
  private onStatusChange: ((status: string) => void) | null = null;

  constructor() {}

  /**
   * Initializes the Peer instance.
   * If a customId is provided (e.g. session ID), it will try to use it.
   */
  async init(onData: (data: SessionState) => void, onStatus: (status: string) => void): Promise<string> {
    this.onDataReceived = onData;
    this.onStatusChange = onStatus;

    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', (id) => {
        console.log('Peer connected with ID:', id);
        this.onStatusChange?.('Ready to connect');
        resolve(id);
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        this.onStatusChange?.(`Error: ${err.type}`);
        reject(err);
      });

      // HOST logic: Listen for incoming connections
      this.peer.on('connection', (conn) => {
        console.log('New player connected:', conn.peer);
        this.connections.push(conn);
        this.onStatusChange?.(`${this.connections.length} players linked`);
        
        conn.on('close', () => {
          this.connections = this.connections.filter(c => c !== conn);
          this.onStatusChange?.(`${this.connections.length} players linked`);
        });
      });
    });
  }

  /**
   * PLAYER logic: Connect to a Host's Peer ID.
   */
  connectToHost(hostPeerId: string) {
    if (!this.peer) return;

    const conn = this.peer.connect(hostPeerId);
    
    conn.on('open', () => {
      console.log('Connected to host:', hostPeerId);
      this.onStatusChange?.('Connected to host');
    });

    conn.on('data', (data) => {
      console.log('Received data from host:', data);
      if (this.onDataReceived && typeof data === 'object') {
        this.onDataReceived(data as SessionState);
      }
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      this.onStatusChange?.('Connection failed');
    });
  }

  /**
   * HOST logic: Broadcast current state to all connected players.
   */
  broadcast(state: SessionState) {
    if (this.connections.length === 0) return;
    
    console.log('Broadcasting state to', this.connections.length, 'peers');
    this.connections.forEach(conn => {
      if (conn.open) {
        conn.send(state);
      }
    });
  }

  destroy() {
    this.connections.forEach(c => c.close());
    this.peer?.destroy();
  }
}

export const syncService = new SyncService();
