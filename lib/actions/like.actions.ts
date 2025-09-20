"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";

import Thread from "../models/thread.model";
import User from "../models/user.model";

export async function checkIfUserLikedThread(threadId: string, clerkUserId: string) {
    try {
        await connectToDB();

        // Find the user by Clerk ID to get the MongoDB ObjectId
        const user = await User.findOne({ id: clerkUserId });
        if (!user) {
            return false;
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return false;
        }

        return thread.likedBy.includes(user._id);
    } catch (error: any) {
        console.error("Error checking if user liked thread:", error);
        return false;
    }
}

export async function likeThread(threadId: string, clerkUserId: string) {
    try {
        await connectToDB();

        // Find the user by Clerk ID to get the MongoDB ObjectId
        const user = await User.findOne({ id: clerkUserId });
        if (!user) {
            throw new Error("User not found");
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            throw new Error("Thread not found");
        }

        const wasLiked = thread.likedBy.includes(user._id);
        
        if (wasLiked) {
            thread.likedBy.pull(user._id);
        } else {
            thread.likedBy.push(user._id);
        }

        await thread.save();
        
        // Revalidate the relevant paths to update the UI
        revalidatePath("/");
        revalidatePath(`/thread/${threadId}`);
        revalidatePath(`/profile/${clerkUserId}`);
        
        return { 
            success: true, 
            isLiked: !wasLiked,
            likeCount: thread.likedBy.length 
        };
    } catch (error: any) {
        throw new Error(`Failed to like thread: ${error.message}`);
    }
}