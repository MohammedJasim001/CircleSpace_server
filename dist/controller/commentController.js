"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const userModel_1 = require("../models/userModel");
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId, content, postId } = req.body;
    // Find the post by its ID
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    // Create a new comment object
    const comment = new commentModel_1.default({
        author: authorId,
        content,
        post: post._id,
    });
    // Save the comment to the database
    yield comment.save();
    // Add the comment ID to the post's comments array
    post.comments.push(comment._id);
    yield post.save();
    // Fetch the author details (assuming you have a User model)
    const author = yield userModel_1.User.findById(authorId);
    if (!author) {
        return res.status(404).json({ message: "Author not found" });
    }
    // Build the response with full author details
    const responseComment = Object.assign(Object.assign({}, comment.toObject()), { author: {
            _id: author._id,
            userName: author.userName,
            profileImage: author.profileImage,
        } });
    // Return the response with the full comment including author details
    return res.status(201).json({
        message: "Comment added successfully",
        data: responseComment,
    });
});
exports.addComment = addComment;
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
