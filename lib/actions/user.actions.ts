"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "mentionedUsers",
          model: User,
          select: "_id id username name",
        },
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

    if (!threads) {
      return null;
    }

    // Serialize the threads to plain objects to avoid circular references
    const serializedThreads = threads.threads.map((thread: any) => ({
      _id: thread._id.toString(),
      text: thread.text,
      author: {
        _id: thread.author._id.toString(),
        id: thread.author.id,
        name: thread.author.name,
        image: thread.author.image,
      },
      community: thread.community ? {
        _id: thread.community._id.toString(),
        id: thread.community.id,
        name: thread.community.name,
        image: thread.community.image,
      } : null,
      createdAt: thread.createdAt,
      parentId: thread.parentId,
      mentionedUsers: thread.mentionedUsers ? thread.mentionedUsers.map((user: any) => ({
        _id: user._id.toString(),
        id: user.id,
        username: user.username,
        name: user.name,
      })) : [],
      children: thread.children.map((child: any) => ({
        _id: child._id.toString(),
        author: {
          _id: child.author._id.toString(),
          name: child.author.name,
          image: child.author.image,
        },
      })),
      likedBy: thread.likedBy ? thread.likedBy.map((id: any) => id.toString()) : [],
    }));

    return {
      _id: threads._id.toString(),
      id: threads.id,
      name: threads.name,
      image: threads.image,
      threads: serializedThreads,
    };
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function searchUsersForMention(searchString: string) {
  try {
    connectToDB();

    if (!searchString.trim()) {
      return [];
    }

    // Create a case-insensitive regular expression for the provided search string
    const regex = new RegExp(searchString, "i");

    const users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ],
    })
      .select("_id id username name image")
      .limit(10)
      .lean();

    return users.map((user: any) => ({
      _id: user._id.toString(),
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
    }));
  } catch (error) {
    console.error("Error searching users for mention:", error);
    return [];
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ---- Replies pipeline ----
    const replies = await Thread.aggregate([
      // Find threads authored by user
      { $match: { author: userObjectId } },
      // Join with children (replies)
      {
        $lookup: {
          from: "threads",
          localField: "children",
          foreignField: "_id",
          as: "childThreads",
        },
      },
      { $unwind: "$childThreads" },
      // Only keep replies not authored by the user
      { $match: { "childThreads.author": { $ne: userObjectId } } },
      // Lookup reply author
      {
        $lookup: {
          from: "users",
          localField: "childThreads.author",
          foreignField: "_id",
          as: "replyAuthor",
        },
      },
      { $unwind: "$replyAuthor" },
      {
        $project: {
          _id: "$childThreads._id",
          text: "$childThreads.text",
          parentId: "$_id",
          createdAt: "$childThreads.createdAt",
          author: {
            _id: "$replyAuthor._id",
            id: "$replyAuthor.id",
            name: "$replyAuthor.name",
            image: "$replyAuthor.image",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // ---- Likes pipeline ----
    const likes = await Thread.aggregate([
      // Get threads authored by the user
      { $match: { author: userObjectId } },
      // Unwind likedBy (each like is its own document)
      { $unwind: "$likedBy" },
      // Skip self-likes
      { $match: { likedBy: { $ne: userObjectId } } },
      // Lookup liker user details
      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "liker",
        },
      },
      { $unwind: "$liker" },
      {
        $project: {
          _id: { $concat: [{ $toString: "$_id" }, "_", { $toString: "$liker._id" }] },
          threadId: "$_id",
          text: "$text",
          createdAt: "$createdAt", // thread createdAt, not per-like timestamp
          author: {
            _id: "$liker._id",
            id: "$liker.id",
            name: "$liker.name",
            image: "$liker.image",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // ---- Mentions pipeline ----
    const mentions = await Thread.aggregate([
      // Find threads where the user is mentioned
      { $match: { mentionedUsers: userObjectId } },
      // Skip threads authored by the user (self-mentions)
      { $match: { author: { $ne: userObjectId } } },
      // Lookup thread author
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "threadAuthor",
        },
      },
      { $unwind: "$threadAuthor" },
      {
        $project: {
          _id: "$_id",
          text: "$text",
          threadId: "$_id",
          parentId: "$parentId",
          createdAt: "$createdAt",
          author: {
            _id: "$threadAuthor._id",
            id: "$threadAuthor.id",
            name: "$threadAuthor.name",
            image: "$threadAuthor.image",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return { replies, likes, mentions };
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
}