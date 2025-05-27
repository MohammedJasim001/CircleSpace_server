import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import Routes
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';
import saveRoutes from './routes/saveRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { initializeSockets } from './utils/socket';

// Import Socket and Controllers


dotenv.config();


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://circle-space-client.vercel.app","http://localhost:3000"],
    credentials: true,
  },
});


// Middleware
app.use(cookieParser());
app.use(cors({ origin: ["https://circle-space-client.vercel.app","http://localhost:3000"], credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/user', authRoutes);
app.use('/api/user', postRoutes);
app.use('/api/user', commentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user', saveRoutes);
app.use('/api/user/message', messageRoutes);
app.use('/api/user/notification', notificationRoutes);

// WebSocket Logic
initializeSockets(io);

// Start the server
const port = process.env.PORT ;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
