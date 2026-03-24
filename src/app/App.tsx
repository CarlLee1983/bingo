import { SessionProvider, useSession } from '../features/session/session-provider';
import { SessionScreen } from '../components/session/SessionScreen';

function SessionApp() {
  const { session } = useSession();

  return <SessionScreen key={session.sessionId} />;
}

export default function App() {
  return (
    <SessionProvider>
      <SessionApp />
    </SessionProvider>
  );
}
