import mongoose, { Document, Model ,Types} from "mongoose";
export interface UserI  extends Document{
    _id:mongoose.Types.ObjectId;
    name:string;
    userName:string,
    email:string,
    password:string,
    profileImage:string,
    bio?:string
    otp:number | undefined,
    isVerified:boolean,
    otpExpire:number | undefined,
    createdAt:Date,
    isBlocked:boolean
    posts:mongoose.Types.ObjectId[]
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    likedPosts?: mongoose.Types.ObjectId[];
    comments?: mongoose.Types.ObjectId[];
    saved?: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<UserI>({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        
    },
    bio: {
        type: String,
        default: "",
      },
    otp:{
        type:Number,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpExpire:{
        type:Number,
        default:null
    },
    createdAt:{
        type:Date,
        
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    posts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    likedPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
      comments: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        default: [],
    },
    saved: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Add saved field
        default: [],
      },
},{timestamps:true})

export const User:Model<UserI> = mongoose.model<UserI>('User',userSchema)

