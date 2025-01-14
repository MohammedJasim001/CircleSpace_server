import { Request, Response } from "express";
import Message from "../models/messageModel";

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// Get messages between two users
export const getMessages = async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error });
  }
};

// Mark a message as read
export const markAsRead = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  try {
    await Message.findByIdAndUpdate(messageId, { isRead: true });
    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark message as read", error });
  }
};
