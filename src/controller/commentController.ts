import { Request, Response } from "express";
import Post from "../models/postModel";
import Comment from "../models/commentModel";
import { User } from "../models/userModel";

export const addComment = async (req: Request, res: Response): Promise<any> => {
  const { authorId, content, postId } = req.body;

  // Find the post by its ID
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Create a new comment object
  const comment = new Comment({
    author: authorId,
    content,
    post: post._id,
  });

  // Save the comment to the database
  await comment.save();

  // Add the comment ID to the post's comments array
  post.comments.push(comment._id);
  await post.save();

  // Fetch the author details (assuming you have a User model)
  const author = await User.findById(authorId);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  // Build the response with full author details
  const responseComment = {
    ...comment.toObject(),
    author: {
      _id: author._id,
      userName: author.userName,
      profileImage: author.profileImage,
    },
  };

  // Return the response with the full comment including author details
  return res.status(201).json({
    message: "Comment added successfully",
    data: responseComment,
  });
};


// export const reply_comment = async (req: Request, res: Response) => {
//   const { authorId, commentId, content } = req.body;

//   const parentComment = await Comment.findById(commentId);
//   if (!parentComment) {
//     return res.status(404).json({ message: "Parent comment not found" });
//   }

//   const reply = new Comment({
//     author: authorId,
//     content,
//     post: parentComment.post,
//   });

//   await reply.save();

//   parentComment.replies.push(reply._id);
//   await parentComment.save();

//   return res.status(201).json({ message: "Reply added successfully", data:reply });
// };