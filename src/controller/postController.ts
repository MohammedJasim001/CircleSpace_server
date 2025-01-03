import mongoose, { Types } from "mongoose";
import { Response,Request } from "express";
import { User } from "../models/userModel";
import Post from "../models/postModel";
import { HttpStatusCode } from "../constants/constat";


export const createPost = async (
  req: Request | any,
  res: Response
): Promise<Response | any> => {
 
    const { author } = req.params;
    const { description } = req.body;

    // Extract image URL from middleware
    const media = req.cloudinaryMediaUrl;

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
    if (!media) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: HttpStatusCode.BAD_REQUEST,
        message: "Please provide an image or video.",
      });
    }

    // Create a new post
    const newPost = new Post({
      author: new Types.ObjectId(author),
      content:media,
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
  
};



export const getPost = async(req:Request, res:Response):Promise<any> =>{

    const posts = await Post.find()
    .populate("author", "userName profileImage")
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      populate: [
        { path: "author", select: "userName profileImage" },
        
      ],
    });
    if(!posts){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,message:'posts not fond'})
    }
    res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK,message:'get all posts',data:posts})
}



export const toggle_like = async (req: Request,res: Response): Promise<any> => {
  const { userId, postId } = req.body; // userId and postId from the request body

  // Validate the format of the IDs
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(postId)) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: "Invalid ID format." });
  }

  // Start a transaction to ensure atomic updates
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the post and user within the session
    const post = await Post.findById(postId).session(session);
    const user = await User.findById(userId).session(session);

    // If the post or user doesn't exist, abort the transaction
    if (!post || !user) {
      await session.abortTransaction();
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: "User or Post not found." });
    }

    // Initialize user.likedPosts if not already initialized
    user.likedPosts = user.likedPosts || [];

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User has already liked the post, so unlike it
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(
        (likedPostId) => likedPostId.toString() !== postId
      );
      
      // Save changes to post and user
      await post.save({ session });
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK, message: "Post unliked successfully." });
    } else {
      // User has not liked the post, so like it
      post.likes.push(userId);
      user.likedPosts.push(postId);

      // Save changes to post and user
      await post.save({ session });
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK, message: "Post liked successfully." });
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Error during like/unlike operation:", error);
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    // End the session
    session.endSession();
  }
};


//getVideoPosts


// Utility function to determine if the content URL is a video
const getMediaTypeFromUrl = (url: string) => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv' ,];
  const extension = url.split('.').pop()?.toLowerCase();
  return videoExtensions.includes(extension!) ? 'video' : 'image'; // Default to 'image'
};

// Controller to fetch all video posts by checking content URL extension
export const getVideoPosts = async (req: Request, res: Response):Promise<any> => {
  
    const posts = await Post.find()
    .populate("author", "userName profileImage")
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      populate: [
        { path: "author", select: "userName profileImage" },
        
      ],
    });
    

    // Filter posts to include only videos based on URL file extension
    const videoPosts = posts.filter((post) => getMediaTypeFromUrl(post.content) === 'video');

    if (videoPosts.length === 0) {
      return res.status(404).json({ message: 'No video posts found' });
    }

    res.status(200).json(videoPosts);
  
};


//save Post
export const postSave = async(req:Request, res:Response):Promise<any> => {
  const {postId } = req.params

  const post = await Post.findById(postId)

  if(!post){
    return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,message:"post not found"})
  }
  

}
