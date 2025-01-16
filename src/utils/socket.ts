import { Server } from 'socket.io';
import { saveMessage } from '../controller/messageController';

export const initializeSockets = (io: Server) => {
  console.log('Initializing sockets...');

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, content } = data;
        const newMessage = await saveMessage(sender, receiver, content);
        io.to(receiver).emit('receiveMessage', newMessage);
        console.log('Message sent:', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
