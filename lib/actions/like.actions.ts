"use server";

import { connectToDB } from "../mongoose";

import Thread from "../models/thread.model";

export async function likeThread(threadId: string, userId: string) {
    try {
        connectToDB();

        const thread = await Thread.findById(threadId);

        if (!thread) {
            throw new Error("Thread not found");
        }

        if (thread.likedBy.includes(userId)) {
            thread.likedBy.pull(userId);
        } else {
            thread.likedBy.push(userId);
        }

        await thread.save();
    } catch (error: any) {
        throw new Error(`Failed to like thread: ${error.message}`);
    }
}