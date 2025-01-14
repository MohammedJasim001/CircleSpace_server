import mongoose, { Document, Model } from "mongoose";

export interface NotificationI extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<NotificationI>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message", "mention"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<NotificationI>("Notification", notificationSchema);
export default Notification
