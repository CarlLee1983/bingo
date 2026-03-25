import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

describe('App phase 1 session shell', () => {
  it('creates a session, adds players, resets, and restores from storage', () => {
    const { unmount } = render(<App />);

    fireEvent.change(screen.getByLabelText(/host name/i), {
      target: { value: 'Alice' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create session/i }));

    expect(screen.getByTestId('session-status-value').textContent).toBe('lobby');
    expect(screen.getByTestId('player-count').textContent).toBe('1');
    expect(screen.getByTestId('player-roster').textContent).toContain('Alice');
    expect(screen.getByTestId('player-roster').textContent).toContain('Host');

    fireEvent.change(screen.getByLabelText(/player name/i), {
      target: { value: 'Bob' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));

    const roster = screen.getByTestId('player-roster');
    expect(within(roster).getAllByRole('listitem')).toHaveLength(2);
    expect(roster.textContent).toContain('Bob');

    const sessionIdBeforeReset = screen.getByTestId('session-id').textContent;
    fireEvent.click(screen.getByRole('button', { name: /reset session/i }));

    expect(screen.getByText('No players yet. Create the session to begin.')).toBeTruthy();
    expect(screen.getByTestId('player-count').textContent).toBe('0');
    expect(screen.getByTestId('session-id').textContent).not.toBe(sessionIdBeforeReset);

    fireEvent.change(screen.getByLabelText(/host name/i), {
      target: { value: 'Alice' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create session/i }));
    fireEvent.change(screen.getByLabelText(/player name/i), {
      target: { value: 'Bob' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));

    const rosterBeforeUnmount = screen.getByTestId('player-roster');
    expect(rosterBeforeUnmount.textContent).toContain('Alice');
    expect(rosterBeforeUnmount.textContent).toContain('Bob');

    unmount();
    render(<App />);

    expect(screen.getByTestId('player-roster').textContent).toContain('Alice');
    expect(screen.getByTestId('player-roster').textContent).toContain('Bob');
    expect(screen.getByTestId('player-count').textContent).toBe('2');
  });
});
