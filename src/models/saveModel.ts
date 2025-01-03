import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
interface ISavedPost extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  savedAt: Date;
}

// Schema
const SavedPostSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Model
const SavedPost = mongoose.model<ISavedPost>('SavedPost', SavedPostSchema);
export default SavedPost;
