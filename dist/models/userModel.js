"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
    },
    bio: {
        type: String,
        default: "",
    },
    otp: {
        type: Number,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpire: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    followers: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    following: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    posts: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    likedPosts: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    comments: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
        default: [],
    },
    saved: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }], // Add saved field
        default: [],
    },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
