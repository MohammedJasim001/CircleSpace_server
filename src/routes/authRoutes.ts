import express from "express";
import { loginUser, registerUser, uploadProfileImage, verifyOtp } from "../controller/authController";
import { uploadMedia } from "../middlewares/imageUploadMiddleware";

const router = express.Router()

router.post('/register',registerUser)
router.post('/verifyotp',verifyOtp)
router.post('/login',loginUser)
router.post('/profileimage',uploadMedia,uploadProfileImage)

export default router