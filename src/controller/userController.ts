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
      select: "image description likes comments createdAt updatedAt",
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
    // {
    //   path: "stories",
    //   select: "content postedAt description isArchived createdAt updatedAt",
    //   populate: {
    //     path: "author",
    //     select: "username profilePicture",
    //   },
    // },
    {
      path: "likedPosts", // Populate likedPosts
      select: "image description likes comments createdAt updatedAt", // Select necessary fields
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
  ]);

  if (!profile) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "User profile retrieved successfully",
    data: profile,
  });
};


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