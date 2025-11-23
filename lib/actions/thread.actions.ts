"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import Tag from "../models/tag.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20, userId: string = "", communityId: string = "") {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  let query: any = {
    parentId: { $in: [null, undefined] },
  };

  if (communityId) {
    const community = await Community.findOne({ id: communityId });
    if (!community) {
      return { posts: [], isNext: false };
    }
    query.communities = community._id;
  } else {
    // Personal feed logic
    let userObjectId = null;
    if (userId) {
      const user = await User.findOne({ id: userId }, { _id: 1 });
      if (user) {
        userObjectId = user._id;
      }
    }

    if (userObjectId) {
      query.author = { $ne: userObjectId }; // Exclude current user using ObjectId
    }
  }

  const postsQuery = Thread.find(query)
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate("author")
    .populate("communities")
    .populate({
      path: "mentionedUsers",
      model: User,
      select: "_id id username name",
    })
    .populate({
      path: "children",
      populate: { path: "author", model: User, select: "_id name parentId image" },
    });

  const posts = await postsQuery.exec();
  const totalPostsCount = await Thread.countDocuments(query);

  let finalPosts = [...posts];

  // If it's the first page and no community is selected, fetch the user's latest 3 posts
  if (!communityId && pageNumber === 1 && userId) {
    const user = await User.findOne({ id: userId }, { _id: 1 });
    if (user) {
      const userPostsQuery = Thread.find({
        parentId: { $in: [null, undefined] },
        author: user._id
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("author")
        .populate("communities")
        .populate({
          path: "mentionedUsers",
          model: User,
          select: "_id id username name",
        })
        .populate({
          path: "children",
          populate: { path: "author", model: User, select: "_id name parentId image" },
        });

      const userPosts = await userPostsQuery.exec();
      finalPosts = [...userPosts, ...finalPosts];
    }
  }

  // Shuffle posts only for personal feed (when no community is selected)
  if (!communityId) {
    finalPosts = finalPosts.sort(() => Math.random() - 0.5);
  }

  // Serialize
  const serializedPosts = finalPosts.map((post: any) => ({
    _id: post._id.toString(),
    text: post.text,
    author: {
      _id: post.author._id.toString(),
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
    },
    communities: post.communities
      ? post.communities.map((community: any) => ({
        _id: community._id.toString(),
        id: community.id,
        name: community.name,
        image: community.image,
      }))
      : [],
    createdAt: post.createdAt,
    parentId: post.parentId,
    mentionedUsers: post.mentionedUsers ? post.mentionedUsers.map((user: any) => ({
      _id: user._id.toString(),
      id: user.id,
      username: user.username,
      name: user.name,
    })) : [],
    children: post.children.map((child: any) => ({
      _id: child._id.toString(),
      author: {
        _id: child.author._id.toString(),
        name: child.author.name,
        image: child.author.image,
      },
    })),
    likedBy: post.likedBy.map((id: any) => id.toString()),
  }));

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts: serializedPosts, isNext };
}



interface Params {
  text: string,
  author: string,
  communityIds: string[],
  path: string,
  mentionedUsers?: string[],
}

export async function createThread({ text, author, communityIds, path, mentionedUsers = [] }: Params
) {
  try {
    connectToDB();

    const communityObjects = await Community.find(
      { id: { $in: communityIds } },
      { _id: 1 }
    );

    // Convert mentioned user IDs to ObjectIds
    const mentionedUserObjectIds = mentionedUsers.length > 0
      ? await User.find({ _id: { $in: mentionedUsers } }).select('_id')
      : [];

    // Extract hashtags from text
    const tags = text.match(/#[a-zA-Z0-9_]+/g);
    const uniqueTags = tags ? Array.from(new Set(tags)) : [];

    const createdThread = await Thread.create({
      text,
      author,
      communities: communityObjects.map((community: any) => community._id),
      mentionedUsers: mentionedUserObjectIds.map((user: any) => user._id),
      tags: uniqueTags,
    });

    // Update Tag model
    if (uniqueTags.length > 0) {
      for (const tag of uniqueTags) {
        await Tag.findOneAndUpdate(
          { name: tag },
          { $push: { threads: createdThread._id } },
          { upsert: true }
        );
      }
    }

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    // Update Community models
    if (communityObjects.length > 0) {
      await Community.updateMany(
        { _id: { $in: communityObjects.map((c: any) => c._id) } },
        { $push: { threads: createdThread._id } }
      );
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.flatMap((thread) => thread.communities?.map((c: any) => c._id?.toString()) || []),
        ...(mainThread.communities?.map((c: any) => c._id?.toString()) || []),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Tag model
    await Tag.updateMany(
      { threads: { $in: descendantThreadIds } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "communities",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "mentionedUsers",
        model: User,
        select: "_id id username name",
      }) // Populate mentioned users
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "mentionedUsers", // Populate mentioned users in children
            model: User,
            select: "_id id username name",
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    if (!thread) {
      return null;
    }

    // Serialize the thread to plain object to avoid circular references
    const serializedThread = {
      _id: thread._id.toString(),
      text: thread.text,
      author: {
        _id: thread.author._id.toString(),
        id: thread.author.id,
        name: thread.author.name,
        image: thread.author.image,
      },
      communities: thread.communities
        ? thread.communities.map((community: any) => ({
          _id: community._id.toString(),
          id: community.id,
          name: community.name,
          image: community.image,
        }))
        : [],
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
        text: child.text,
        author: {
          _id: child.author._id.toString(),
          id: child.author.id,
          name: child.author.name,
          image: child.author.image,
        },
        communities: child.communities
          ? child.communities.map((community: any) => ({
            _id: community._id.toString(),
            id: community.id,
            name: community.name,
            image: community.image,
          }))
          : [],
        createdAt: child.createdAt,
        parentId: child.parentId,
        mentionedUsers: child.mentionedUsers ? child.mentionedUsers.map((user: any) => ({
          _id: user._id.toString(),
          id: user.id,
          username: user.username,
          name: user.name,
        })) : [],
        children: child.children ? child.children.map((grandChild: any) => ({
          _id: grandChild._id.toString(),
          author: {
            _id: grandChild.author._id.toString(),
            name: grandChild.author.name,
            image: grandChild.author.image,
          },
        })) : [],
        likedBy: child.likedBy ? child.likedBy.map((id: any) => id.toString()) : [],
      })),
      likedBy: thread.likedBy.map((id: any) => id.toString()),
    };

    return serializedThread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string,
  mentionedUsers: string[] = []
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Convert mentioned user IDs to ObjectIds
    const mentionedUserObjectIds = mentionedUsers.length > 0
      ? await User.find({ _id: { $in: mentionedUsers } }).select('_id')
      : [];

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
      mentionedUsers: mentionedUserObjectIds.map((user: any) => user._id),
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}