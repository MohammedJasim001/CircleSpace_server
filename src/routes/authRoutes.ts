import express from "express";
import { loginUser, registerUser, uploadProfileImage, verifyOtp } from "../controller/authController";
import { uploadImage } from "../middlewares/imageUploadMiddleware";

const router = express.Router()

router.post('/register',registerUser)
router.post('/verifyotp',verifyOtp)
router.post('/login',loginUser)
router.post('/profileimage',uploadImage,uploadProfileImage)

export default router