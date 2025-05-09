import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  description: string;
  comments: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    description: { type: String },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;