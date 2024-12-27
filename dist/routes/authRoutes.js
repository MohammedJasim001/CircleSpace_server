"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const imageUploadMiddleware_1 = require("../middlewares/imageUploadMiddleware");
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/verifyotp', authController_1.verifyOtp);
router.post('/login', authController_1.loginUser);
router.post('/profileimage', imageUploadMiddleware_1.uploadImage, authController_1.uploadProfileImage);
exports.default = router;
