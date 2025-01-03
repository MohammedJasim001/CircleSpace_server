import { Request, Response } from 'express';
import { User } from '../models/userModel';

export const toggleSavePost = async (req: Request, res: Response):Promise<any> => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedPosts = user.savedPosts || [];
    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter((savedPost) => savedPost.toString() !== postId);
      await user.save();
      return res.status(200).json({ message: 'Post unsaved successfully', savedPosts: user.savedPosts });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.status(201).json({ message: 'Post saved successfully', savedPosts: user.savedPosts });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
