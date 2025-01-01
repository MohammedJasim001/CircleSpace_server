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
exports.loginUser = exports.uploadProfileImage = exports.verifyOtp = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userJoi_1 = __importDefault(require("../validations/userJoi"));
const userModel_1 = require("../models/userModel");
const otpService_1 = __importDefault(require("../utils/otpService"));
const constat_1 = require("../constants/constat");
dotenv_1.default.config();
//register
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, error } = userJoi_1.default.validate(req.body);
    if (error) {
        console.log(error, "error from validation");
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({ status: constat_1.HttpStatusCode.BAD_REQUEST, message: "Found validation error", error });
    }
    console.log("registration initiated");
    const { name, userName, email, password } = value;
    const userExistByEmail = yield userModel_1.User.findOne({ email });
    const userExistByUserName = yield userModel_1.User.findOne({ userName });
    if (userExistByEmail === null || userExistByEmail === void 0 ? void 0 : userExistByEmail.isVerified) {
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({ status: constat_1.HttpStatusCode.BAD_REQUEST, message: "email already exists" });
    }
    if (userExistByUserName === null || userExistByUserName === void 0 ? void 0 : userExistByUserName.isVerified) {
        return res.status(constat_1.HttpStatusCode.BAD_REQUEST).json({ status: constat_1.HttpStatusCode.BAD_REQUEST, message: "UserName already exists" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const otpExpire = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes
    if (userExistByEmail) {
        // If the user already exists and is verified, return an error
        // Update only the OTP and its expiration for unverified users
        userExistByEmail.otp = otp;
        userExistByEmail.otpExpire = otpExpire;
        yield userExistByEmail.save();
    }
    else {
        // For new users, hash the password and save all user details
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            name,
            userName,
            email,
            password: hashedPassword,
            otp,
            otpExpire,
        });
        yield newUser.save();
    }
    // Send OTP email
    try {
        yield (0, otpService_1.default)({
            email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>
                   <h3>OTP will expire within 2 minutes</h3>`,
        });
    }
    catch (error) {
        // Delete the user entry if it's a new registration and sending OTP fails
        if (!userExistByEmail) {
            yield userModel_1.User.findOneAndDelete({ email });
        }
        return res.status(constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: "Error sending OTP to email" });
    }
    res.status(constat_1.HttpStatusCode.CREATED).json({
        success: true,
        status: constat_1.HttpStatusCode.CREATED,
        message: "OTP sent to email",
    });
});
exports.registerUser = registerUser;
//otpverification
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield userModel_1.User.findOne({ email });
    console.log(user === null || user === void 0 ? void 0 : user.otp, otp);
    if (!user) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, success: false, message: 'User not found' });
    }
    if (user.otp !== otp) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, success: false, message: 'invalid otp' });
    }
    if (user.otpExpire && user.otpExpire < Date.now()) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, success: false, message: 'otp time expire' });
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;
    yield user.save();
    res.status(constat_1.HttpStatusCode.CREATED).json({ status: constat_1.HttpStatusCode.CREATED, success: true, message: 'OTP verification successfull' });
});
exports.verifyOtp = verifyOtp;
//profileImage
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const media = req.cloudinaryMediaUrl;
    if (!media) {
        return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: 'Profile image is required' });
    }
    try {
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
        }
        user.profileImage = media;
        yield user.save();
        return res.status(constat_1.HttpStatusCode.OK).json({
            status: constat_1.HttpStatusCode.OK,
            message: 'Profile image updated successfully',
            imageUrl: user.profileImage,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
    }
});
exports.uploadProfileImage = uploadProfileImage;
//login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExist = yield userModel_1.User.findOne({ email });
        if (!userExist) {
            return res.status(constat_1.HttpStatusCode.NOT_FOUND).json({ status: constat_1.HttpStatusCode.NOT_FOUND, message: "User does not exist" });
        }
        if (userExist.isBlocked) {
            return res.status(constat_1.HttpStatusCode.FORBIDDEN).json({ status: constat_1.HttpStatusCode.FORBIDDEN, message: "User is blocked by the admin" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, userExist.password);
        if (!validPassword) {
            return res.status(constat_1.HttpStatusCode.UNAUTHORIZED).json({ status: constat_1.HttpStatusCode.UNAUTHORIZED, message: "Incorrect password" });
        }
        // Generate token for a valid user
        const token = jsonwebtoken_1.default.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        // Exclude password from user data before sending response
        // const { password: hashedPassword,...data} = userExist.toObject();
        // Set cookie with token
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
        res
            .cookie("Access_token", token, { httpOnly: true, expires: expiryDate })
            .status(constat_1.HttpStatusCode.OK)
            .json({ success: true, message: "Login successful", token, status: constat_1.HttpStatusCode.OK,
            user: {
                name: userExist.name,
                id: userExist._id,
                email: userExist.email,
                userName: userExist.userName,
                profileImage: userExist.profileImage,
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: constat_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: "An error occurred during login" });
    }
});
exports.loginUser = loginUser;
