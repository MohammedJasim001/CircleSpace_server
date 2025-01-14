import { Request, Response } from "express";
import Notification from "../models/notificationModel";

// Create a notification
export const createNotification = async (req: Request, res: Response) => {
  const { userId, type, message } = req.body;

  try {
    const newNotification = await Notification.create({
      user: userId,
      type,
      message,
    });

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification", error });
  }
};

// Get notifications for a user
export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve notifications", error });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read", error });
  }
};
