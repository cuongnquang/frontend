import { io, Socket } from 'socket.io-client';

// Provide a factory so callers can create a token-authenticated socket and control connect/disconnect.
const DEFAULT_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
const DEFAULT_PATH = '/api/socket.io/';

export function createSocket(token?: string, url = DEFAULT_URL, path = DEFAULT_PATH): Socket {
  const opts: any = {
    autoConnect: false,
    withCredentials: true,
    path,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  };

  if (token) {
    opts.auth = { token };
  }

  const s = io(url, opts);

  s.on('connect', () => {
    console.debug('[socket] connected');
  });

  s.on('disconnect', (reason: any) => {
    console.debug('[socket] disconnected', reason);
  });

  return s;
}
