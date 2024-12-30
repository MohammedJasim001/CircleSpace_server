import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes'
import postRoutes from './routes/postRoutes'
import commentRoutes from './routes/commentRoutes'
import userRoutes from './routes/userRoutes'

dotenv.config();

const app = express();
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));



app.use(express.json());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/user', authRoutes);
app.use('/api/user', postRoutes)
app.use('/api/user',commentRoutes)
app.use('/api/user',userRoutes)


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
