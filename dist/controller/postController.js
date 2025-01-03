"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.postSave = exports.getVideoPosts = exports.toggle_like = exports.getPost = exports.createPost = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userModel_1 = require("../models/userModel");
const postModel_1 = __importDefault(require("../models/postModel"));
const constat_1 = require("../constants/constat");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author } = req.params;
    const { description } = req.body;
    // Extract image URL from middleware
    const media = req.cloudinaryMediaUrl;
    // Validate author ID format
    if (!mongoose_1.default.isValidObjectId(author)) {
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({
            status: constat_1.HttpStatusCode.BAD_REQUEST,
            message: "Invalid ID format for author",
        });
    }
    // Check if the author exists
    const user = yield userModel_1.User.findById(author);
    if (!user) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({
            status: constat_1.HttpStatusCode.NOT_FOUND,
            message: "Author not found",
        });
    }
    // Ensure image content is provided
    if (!media) {
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({
            status: constat_1.HttpStatusCode.BAD_REQUEST,
            message: "Please provide an image or video.",
        });
    }
    // Create a new post
    const newPost = new postModel_1.default({
        author: new mongoose_1.Types.ObjectId(author),
        content: media,
        description,
    });
    yield newPost.save();
    // Update the user's posts array
    yield userModel_1.User.updateOne({ _id: new mongoose_1.Types.ObjectId(author) }, { $push: { posts: newPost._id } });
    return res.status(constat_1.HttpStatusCode.CREATED).json({
        success: true,
        status: constat_1.HttpStatusCode.CREATED,
        message: "Post created successfully",
        data: newPost,
    });
});
exports.createPost = createPost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postModel_1.default.find()
        .populate("author", "userName profileImage")
        .sort({ createdAt: -1 })
        .populate({
        path: "comments",
        populate: [
            { path: "author", select: "userName profileImage" },
        ],
    });
    if (!posts) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: 'posts not fond' });
    }
    res.status(constat_1.HttpStatusCode.OK).json({ success: true, status: constat_1.HttpStatusCode.OK, message: 'get all posts', data: posts });
});
exports.getPost = getPost;
const toggle_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body; // userId and postId from the request body
    // Validate the format of the IDs
    if (!mongoose_1.default.isValidObjectId(userId) || !mongoose_1.default.isValidObjectId(postId)) {
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({ status: constat_1.HttpStatusCode.BAD_REQUEST, message: "Invalid ID format." });
    }
    // Start a transaction to ensure atomic updates
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the post and user within the session
        const post = yield postModel_1.default.findById(postId).session(session);
        const user = yield userModel_1.User.findById(userId).session(session);
        // If the post or user doesn't exist, abort the transaction
        if (!post || !user) {
            yield session.abortTransaction();
            return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: "User or Post not found." });
        }
        // Initialize user.likedPosts if not already initialized
        user.likedPosts = user.likedPosts || [];
        // Check if the user has already liked the post
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            // User has already liked the post, so unlike it
            post.likes = post.likes.filter((like) => like.toString() !== userId);
            user.likedPosts = user.likedPosts.filter((likedPostId) => likedPostId.toString() !== postId);
            // Save changes to post and user
            yield post.save({ session });
            yield user.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constat_1.HttpStatusCode.OK).json({ status: constat_1.HttpStatusCode.OK, message: "Post unliked successfully." });
        }
        else {
            // User has not liked the post, so like it
            post.likes.push(userId);
            user.likedPosts.push(postId);
            // Save changes to post and user
            yield post.save({ session });
            yield user.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constat_1.HttpStatusCode.OK).json({ status: constat_1.HttpStatusCode.OK, message: "Post liked successfully." });
        }
    }
    catch (error) {
        // If any error occurs, abort the transaction
        yield session.abortTransaction();
        console.error("Error during like/unlike operation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
    finally {
        // End the session
        session.endSession();
    }
});
exports.toggle_like = toggle_like;
//getVideoPosts
// Utility function to determine if the content URL is a video
const getMediaTypeFromUrl = (url) => {
    var _a;
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv',];
    const extension = (_a = url.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    return videoExtensions.includes(extension) ? 'video' : 'image'; // Default to 'image'
};
// Controller to fetch all video posts by checking content URL extension
const getVideoPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postModel_1.default.find()
        .populate("author", "userName profileImage")
        .sort({ createdAt: -1 })
        .populate({
        path: "comments",
        populate: [
            { path: "author", select: "userName profileImage" },
        ],
    });
    // Filter posts to include only videos based on URL file extension
    const videoPosts = posts.filter((post) => getMediaTypeFromUrl(post.content) === 'video');
    if (videoPosts.length === 0) {
        return res.status(404).json({ message: 'No video posts found' });
    }
    res.status(200).json(videoPosts);
});
exports.getVideoPosts = getVideoPosts;
//save Post
const postSave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: "post not found" });
    }
});
exports.postSave = postSave;
