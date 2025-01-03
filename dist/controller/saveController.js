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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSavePost = void 0;
const userModel_1 = require("../models/userModel");
const toggleSavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, postId } = req.body;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.savedPosts = user.savedPosts || [];
        const isSaved = user.savedPosts.includes(postId);
        if (isSaved) {
            user.savedPosts = user.savedPosts.filter((savedPost) => savedPost.toString() !== postId);
            yield user.save();
            return res.status(200).json({ message: 'Post unsaved successfully', savedPosts: user.savedPosts });
        }
        else {
            user.savedPosts.push(postId);
            yield user.save();
            return res.status(201).json({ message: 'Post saved successfully', savedPosts: user.savedPosts });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.toggleSavePost = toggleSavePost;
