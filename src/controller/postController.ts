import mongoose, { Types } from "mongoose";
import { Response,Request } from "express";
import { User } from "../models/userModel";
import Post from "../models/postModel";
import { HttpStatusCode } from "../constants/constat";


export const createPost = async (
  req: Request | any,
  res: Response
): Promise<Response | any> => {
  try {
    const { author } = req.params;
    const { description } = req.body;

    // Extract image URL from middleware
    const image = req.cloudinaryImageUrl;

    // Validate author ID format
    if (!mongoose.isValidObjectId(author)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: HttpStatusCode.BAD_REQUEST,
        message: "Invalid ID format for author",
      });
    }

    // Check if the author exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: HttpStatusCode.NOT_FOUND,
        message: "Author not found",
      });
    }

    // Ensure image content is provided
    if (!image) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: HttpStatusCode.BAD_REQUEST,
        message: "Please provide an image.",
      });
    }

    // Create a new post
    const newPost = new Post({
      author: new Types.ObjectId(author),
      image,
      description,
    });

    await newPost.save();

    // Update the user's posts array
    await User.updateOne(
      { _id: new Types.ObjectId(author) },
      { $push: { posts: newPost._id } }
    );

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      status: HttpStatusCode.CREATED,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "An error occurred while creating the post",
    });
  }
};



export const getPost = async(req:Request, res:Response):Promise<any> =>{

    const posts = await Post.find()
    .populate("author", "userName profileImage")
    .sort({ createdAt: -1 });
    // .populate({
    //   path: "comments",
    //   populate: [
    //     { path: "author", select: "userName profilePicture" },
        
    //   ],
    // });
    if(!posts){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,message:'posts not fond'})
    }
    res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK,message:'get all posts',data:posts})
}