"use server";

import { connectToDB } from "../mongoose";
import Tag from "../models/tag.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import Community from "../models/community.model";

export async function fetchTrendingTags() {
    connectToDB();

    try {
        const tags = await Tag.aggregate([
            {
                $project: {
                    name: 1,
                    threadCount: { $size: "$threads" },
                },
            },
            { $sort: { threadCount: -1 } },
            { $limit: 10 },
        ]);

        return tags;
    } catch (error: any) {
        throw new Error(`Failed to fetch trending tags: ${error.message}`);
    }
}

export async function fetchPostsByTag(tag: string, pageNumber = 1, pageSize = 20) {
    connectToDB();

    try {
        const skipAmount = (pageNumber - 1) * pageSize;

        const tagDoc = await Tag.findOne({ name: tag });

        if (!tagDoc) {
            return { posts: [], isNext: false };
        }

        const postsQuery = Thread.find({ _id: { $in: tagDoc.threads } })
            .sort({ createdAt: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            })
            .populate({
                path: "community",
                model: Community,
            })
            .populate({
                path: "children",
                populate: {
                    path: "author",
                    model: User,
                    select: "_id name parentId image",
                },
            });

        const totalPostsCount = await Thread.countDocuments({
            _id: { $in: tagDoc.threads },
        });

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch posts by tag: ${error.message}`);
    }
}
