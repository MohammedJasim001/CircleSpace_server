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
exports.editProfile = exports.searchUsers = exports.toggleFollow = exports.getUserById = exports.suggestionProfiles = exports.profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("../models/userModel");
const constat_1 = require("../constants/constat");
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const profile = yield userModel_1.User.findById(id).populate([
        {
            path: "posts",
            select: "content description likes comments createdAt updatedAt",
            options: { sort: { createdAt: -1 } },
            populate: [
                {
                    path: "comments",
                    select: "_id",
                },
                {
                    path: "likes",
                    select: "_id",
                },
            ],
        },
        {
            path: "savedPosts", // Populate likedPosts
            select: "content description likes comments createdAt updatedAt", // Select necessary fields
            options: { sort: { createdAt: -1 } },
            populate: [
                {
                    path: "comments",
                    select: "_id", // Assuming you want to populate comment IDs
                },
                {
                    path: "likes",
                    select: "_id", // Assuming you want to populate like IDs
                },
            ],
        },
        {
            path: "followers",
            select: "userName profileImage", // Select necessary fields for followers
            populate: [
                {
                    path: "followers",
                    select: "userName profileImage", // Followers of followers
                },
                {
                    path: "following",
                    select: "userName profileImage", // Following of followers
                },
            ],
        },
        {
            path: "following",
            select: "userName profileImage", // Select necessary fields for following
            populate: [
                {
                    path: "followers",
                    select: "userName profileImage", // Followers of following
                },
                {
                    path: "following",
                    select: "userName profileImage", // Following of following
                },
            ],
        },
    ]);
    if (!profile) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
        message: "User profile retrieved successfully",
        data: profile,
    });
});
exports.profile = profile;
//suggested profile
const suggestionProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    const allprofiles = yield userModel_1.User.find();
    const profiles = allprofiles.filter((profile) => !(profile === null || profile === void 0 ? void 0 : profile._id.equals(id)));
    if (!profiles) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
        message: "Suggested profiles retrieved successfully",
        data: profiles,
    });
});
exports.suggestionProfiles = suggestionProfiles;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.User.findById(id)
        .populate('posts')
        .populate('followers') // Populate followers
        .populate('following');
    if (!user) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    return res.json(user);
});
exports.getUserById = getUserById;
//togglefollow
const toggleFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, targetId } = req.body;
    if (!mongoose_1.default.isValidObjectId(userId) ||
        !mongoose_1.default.isValidObjectId(targetId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    if (userId === targetId) {
        return res
            .status(400)
            .json({ message: "You can't follow/unfollow yourself." });
    }
    const currentUser = yield userModel_1.User.findById(userId);
    const targetUser = yield userModel_1.User.findById(targetId);
    if (!currentUser || !targetUser) {
        return res.status(404).json({ message: "User not found." });
    }
    const isFollowing = currentUser.following.includes(targetId);
    if (isFollowing) {
        currentUser.following = currentUser.following.filter((id) => id.toString() !== targetId);
        targetUser.followers = targetUser.followers.filter((id) => id.toString() !== userId);
        yield currentUser.save();
        yield targetUser.save();
        return res.status(200).json({ message: "Unfollowed successfully." });
    }
    else {
        currentUser.following.push(targetId);
        targetUser.followers.push(userId);
        yield currentUser.save();
        yield targetUser.save();
        return res.status(200).json({ message: "Followed successfully." });
    }
});
exports.toggleFollow = toggleFollow;
//searchUsers
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
    }
    // Perform the search on the User collection
    const users = yield userModel_1.User.find({
        $or: [
            { userName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
        ],
    });
    // Return the found users as response
    return res.status(200).json(users);
});
exports.searchUsers = searchUsers;
//edit userProfile
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { bio, userName, name } = req.body;
    const media = req.cloudinaryMediaUrl;
    console.log(media);
    const user = yield userModel_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (userName) {
        const existingUser = yield userModel_1.User.findOne({ userName });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Username already taken" });
        }
        user.userName = userName;
    }
    if (media) {
        user.profileImage = media;
    }
    if (bio !== undefined)
        user.bio = bio;
    if (name)
        user.name = name;
    if (userName)
        user.userName = userName;
    // Save updated user
    yield user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
});
exports.editProfile = editProfile;
