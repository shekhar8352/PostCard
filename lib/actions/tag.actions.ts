"use server";

import { connectToDB } from "../mongoose";
import Tag from "../models/tag.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import Community from "../models/community.model";

export async function fetchTrendingTags(limit = 10) {
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
            { $limit: limit },
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
                path: "communities",
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

        const serializedPosts = posts.map((post: any) => ({
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
    } catch (error: any) {
        throw new Error(`Failed to fetch posts by tag: ${error.message}`);
    }
}
