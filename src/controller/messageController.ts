import { Request, Response } from 'express';
import Message from '../models/messageModel'; // Assuming you have a Message model
import { Types } from 'mongoose';

// Save a message to the database
export const saveMessage = async (sender: string, receiver: string, content: string) => {
  try {
    const newMessage = new Message({
      sender,
      receiver,
      content,
      timestamp: new Date(),
    });

    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw new Error('Failed to save message');
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({
      sender,
      receiver,
      content,
      timestamp: new Date(),
    });

    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get recent chat messages for a specific user
export const getRecentChatMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'userName profileImage')
      .populate('receiver', 'userName profileImage')
      .sort({ timestamp: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Get a list of recent chat users (based on last message sent or received)
export const getRecentChatUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ timestamp: -1 })
      .populate('sender', 'userName profileImage')
      .populate('receiver', 'userName profileImage');

    const recentChats: { chatPartner: Types.ObjectId; latestMessage: string; timestamp: Date }[] = [];
    const seenUsers = new Set();

    messages.forEach((msg) => {
      const chatPartner = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;

      if (!seenUsers.has(chatPartner._id.toString())) {
        recentChats.push({
          chatPartner,
          latestMessage: msg.content,
          timestamp: msg.timestamp,
        });
        seenUsers.add(chatPartner._id.toString());
      }
    });

    res.status(200).json(recentChats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent chat users' });
  }
};
