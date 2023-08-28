"use server";

import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  name: string;
  bio: string;
  username: string;
  image: string;
  path: string;
}

export const updateUser = async ({
  userId,
  name,
  bio,
  username,
  image,
  path,
}: Params) => {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        onboarded: true,
        name,
        bio,
        username: username.toLowerCase(),
        image,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const fetchUser = async (userId: string): Promise<any> => {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export const fetchUsers = async ({
  userId,
  pageSize = 20,
  pageNumber = 1,
  searchString = "",
  sortBy,
}: {
  userId: string;
  pageSize: number;
  pageNumber: number;
  searchString?: string;
  sortBy: SortOrder;
}) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const sort = {
      createdAt: sortBy,
    };
    const searchQuery = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (!(searchString.trim() === "")) {
      query["$or"] = [{ name: searchQuery }, { username: searchQuery }];
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sort);

    const total = await User.countDocuments(query);

    const isNext = pageNumber * pageSize < total;

    return {
      users,
      total,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleLike = async ({
  userId,
  threadId,
}: {
  userId: string;
  threadId: string;
}) => {
  try {
    connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const postIndex = user.likedThreads.indexOf(threadId);

    if (postIndex === -1) {
      // Post is not liked, so add it to the likedPosts array
      user.likedThreads.unshift(threadId);
    } else {
      // Post is already liked, so remove it from the likedThreads array
      user.likedThreads.splice(postIndex, 1);
    }

    const updateUser = await user.save();

    return updateUser.likedThreads;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}
