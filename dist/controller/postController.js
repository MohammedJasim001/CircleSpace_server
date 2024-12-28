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
exports.getPost = exports.createPost = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userModel_1 = require("../models/userModel");
const postModel_1 = __importDefault(require("../models/postModel"));
const constat_1 = require("../constants/constat");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author } = req.params;
        const { description } = req.body;
        // Extract image URL from middleware
        const image = req.cloudinaryImageUrl;
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
        if (!image) {
            return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({
                status: constat_1.HttpStatusCode.BAD_REQUEST,
                message: "Please provide an image.",
            });
        }
        // Create a new post
        const newPost = new postModel_1.default({
            author: new mongoose_1.Types.ObjectId(author),
            image,
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
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "An error occurred while creating the post",
        });
    }
});
exports.createPost = createPost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postModel_1.default.find()
        .populate("author", "userName profileImage")
        .sort({ createdAt: -1 });
    // .populate({
    //   path: "comments",
    //   populate: [
    //     { path: "author", select: "userName profilePicture" },
    //   ],
    // });
    if (!posts) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: 'posts not fond' });
    }
    res.status(constat_1.HttpStatusCode.OK).json({ success: true, status: constat_1.HttpStatusCode.OK, message: 'get all posts', data: posts });
});
exports.getPost = getPost;