import mongoose from "mongoose";
import { User, UserI } from "../models/userModel";
import { Request, Response } from "express";
import { HttpStatusCode } from "../constants/constat";


export const profile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const profile = await User.findById(id).populate([
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
  ])


  if (!profile) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "User profile retrieved successfully",
    data: profile,
  });
};

//suggested profile
export const suggestionProfiles = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id } = req.params;
  
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  
    const allprofiles = await User.find();
    const profiles = allprofiles.filter(
      (profile: UserI) => !profile?._id.equals(id)
    );
  
    if (!profiles) {
      return res.status(404).json({ message: "User not found" });
    }
  
    return res.status(200).json({
      message: "Suggested profiles retrieved successfully",
      data: profiles,
    });
  };

  export const getUserById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = await User.findById(id)
    .populate('posts')
    .populate('followers')  // Populate followers
    .populate('following');

    if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    return res.json(user);
};


//togglefollow
export const toggleFollow = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { userId, targetId } = req.body;
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(targetId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (userId === targetId) {
    return res
      .status(400)
      .json({ message: "You can't follow/unfollow yourself." });
  }

  const currentUser = await User.findById(userId);
  const targetUser = await User.findById(targetId);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ message: "User not found." });
  }
  const isFollowing = currentUser.following.includes(targetId);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: "Unfollowed successfully." });
  } else {
    currentUser.following.push(targetId);
    targetUser.followers.push(userId);

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: "Followed successfully." });
  }
};


//searchUsers
export const searchUsers = async (req: Request, res: Response):Promise<any> => {

  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  // Perform the search on the User collection
  const users = await User.find({
    $or: [
      { userName: { $regex: query, $options: "i" } }, 
      { email: { $regex: query, $options: "i" } }, 
    ],
  });

  // Return the found users as response
  return res.status(200).json(users); 

};

//edit userProfile
export const editProfile = async (req: Request | any, res: Response):Promise<any> => {

  
    const { userId } = req.params;
    const { bio, userName, name} = req.body;
    const media = req.cloudinaryMediaUrl;

    console.log(media);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (userName) {
      const existingUser = await User.findOne({ userName });
      if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ message: "Username already taken" });
      }
      user.userName = userName;
  }

    if (media) {
      user.profileImage = media; 
    }
    if (bio !== undefined) user.bio = bio;
    if (name) user.name = name;
    if (userName) user.userName = userName

    // Save updated user
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });

};
