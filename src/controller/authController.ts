import { Request, Response,} from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import userAuthJoi from "../validations/userJoi";
import { User } from "../models/userModel";
import sendOtpToEMail from "../utils/otpService";
import { HttpStatusCode } from "../constants/constat";


env.config()

//register
export const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { value, error } = userAuthJoi.validate(req.body);

    if (error) {
        console.log(error, "error from validation");
        return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: "Found validation error", error });
    }

    console.log("registration initiated");

    const {name, userName, email, password} = value;

    const userExistByEmail = await User.findOne({ email });
    const userExistByUserName = await User.findOne({ userName });

    if (userExistByEmail?.isVerified) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: "email already exists" });
    }

    if (userExistByUserName?.isVerified) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: "UserName already exists" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const otpExpire = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

    if (userExistByEmail) {
        // If the user already exists and is verified, return an error

        // Update only the OTP and its expiration for unverified users
        userExistByEmail.otp = otp;
        userExistByEmail.otpExpire = otpExpire;
        await userExistByEmail.save();
    } else {
        // For new users, hash the password and save all user details
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            userName,
            email,
            password: hashedPassword,
            otp,
            otpExpire,
        });

        await newUser.save();
    }

    
    // Send OTP email
    try {
        await sendOtpToEMail({
            email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>
                   <h3>OTP will expire within 2 minutes</h3>`,
        });
    } catch (error) {
        // Delete the user entry if it's a new registration and sending OTP fails
        if (!userExistByEmail) {
            await User.findOneAndDelete({ email });
        }
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status:HttpStatusCode.INTERNAL_SERVER_ERROR, message: "Error sending OTP to email" });
    }

    res.status(HttpStatusCode.CREATED).json({
        success:true,
        status:HttpStatusCode.CREATED,
        message: "OTP sent to email",
    });
};


//otpverification
export const verifyOtp = async (req:Request,res:Response):Promise<any>=>{
    
    const {email, otp} = req.body
    
    const user = await User.findOne({email })
    console.log(user?.otp,otp);
    

    if(!user){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,success:false,message:'User not found'})
    }
    if(user.otp !== otp){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,success:false,message:'invalid otp'})
    }
    if(user.otpExpire&&user.otpExpire<Date.now()){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,success:false,message:'otp time expire'})
    }
    user.otp = undefined
    user.otpExpire = undefined
    user.isVerified=true
    await user.save()
    res.status(HttpStatusCode.CREATED).json({status:HttpStatusCode.CREATED,success:true,message:'OTP verification successfull'})
}

//profileImage


export const uploadProfileImage = async (req: Request|any, res: Response): Promise<any> => {
    const { email } = req.body; 
    
    const media = req.cloudinaryMediaUrl;


    if (!media) {
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'Profile image is required' });
    }

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
        }

        user.profileImage = media;
        await user.save();

        return res.status(HttpStatusCode.OK).json({
            status:HttpStatusCode.OK,
            message: 'Profile image updated successfully',
            imageUrl: user.profileImage, 
        });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status:HttpStatusCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
    }
};


//login
export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: "User does not exist" });
        }

        if (userExist.isBlocked) {
            return res.status(HttpStatusCode.FORBIDDEN).json({status:HttpStatusCode.FORBIDDEN, message: "User is blocked by the admin" });
        }

        const validPassword = await bcrypt.compare(password, userExist.password);
        if (!validPassword) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({status:HttpStatusCode.UNAUTHORIZED, message: "Incorrect password" });
        }

        // Generate token for a valid user
        const token = jwt.sign(
            { id: userExist._id },
            process.env.JWT_SECRET_KEY as string, 
            { expiresIn: "1h" } 
        );

        // Exclude password from user data before sending response
        // const { password: hashedPassword,...data} = userExist.toObject();
        
        // Set cookie with token
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
        res
            .cookie("Access_token", token, { httpOnly: true, expires: expiryDate })
            .status(HttpStatusCode.OK)
            .json({success:true, message: "Login successful", token ,status:HttpStatusCode.OK,
                user:{
                name:userExist.name,
                id:userExist._id,
                email:userExist.email,
                userName:userExist.userName,
                profileImage:userExist.profileImage,
            }
            });
    } catch (error) {
        console.error("Login error:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({status:HttpStatusCode.INTERNAL_SERVER_ERROR, message: "An error occurred during login" });
    }
};

