import { io } from 'socket.io-client';

// Point to the backend server URL, which is likely on a different port than the frontend.
const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  // If the NestJS backend has a global prefix (e.g., /api),
  // the client needs to specify the path for the socket connection.
  path: '/api/socket.io/',
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});