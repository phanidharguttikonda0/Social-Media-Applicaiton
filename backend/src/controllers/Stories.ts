import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";
import getUserId from "../Services/getUserId";
import { PrismaClient } from "@prisma/client";
import { getUserIdbyStoryId } from "../Services/Stories";
import { truncate } from "fs";

const prisma = new PrismaClient();

export async function createStory(req: AuthenticatedRequest, res: Response) {

    try {
        const user_id = await getUserId(req.user?.username || "") as number;
        const url = req.body.url;
        const type = req.body.type;
        const result = await prisma.stories.create({
            data: {
                CDNURL: url,
                type: type,
                user_id: user_id,
            }
        });
        res.json({ message: "successfully created story", data: true });
    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: null });
    }

}


export async function getViews(req: AuthenticatedRequest, res: Response) {
    try {
        const story_id = req.body.story_id;
        const result1 = await getUserIdbyStoryId(story_id);
        const user_id = await getUserId(req.user?.username || "") as number;
        if (user_id === result1) {
            const result = await prisma.storyViews.findMany({
                where: {
                    story_id: story_id
                },
                select: {
                    user: {
                        select: {
                            user_id: true,
                            username: true,
                            profilePicture: true
                        }
                    }
                }
            });
            console.log(`result was ${result}`);
            res.json({ message: "success", data: result });
        } else {
            res.json({ message: "unauthorized access not an owner", data: null });
        }
    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: null });
    }
}


export async function getViewsCount(req: AuthenticatedRequest, res: Response) {
    try {
        // there is no need to views count as getViews return an array of users
        // that length will be views count
    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: null });
    }
}


export async function deleteStory(req: AuthenticatedRequest, res: Response) {
    try {

        const story_id = req.body.story_id;
        const story_owner = await getUserIdbyStoryId(story_id);
        const user_id = await getUserId(req.user?.username || "") as number;

        if (story_owner === user_id) {
            const result = await prisma.stories.delete({
                where: {
                    story_id: story_id
                }
            });
            // as we mention onDelete: Cascade in story views all those will also be deleted
            res.json({ message: "success", data: true });
        } else {
            res.json({ message: "only owner can delete", data: false });
        }

    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: null });
    }
}


export async function getStories(req: AuthenticatedRequest, res: Response) {
    // returns all the stories of the followers along with their profile pic and username
    // returns all the stories of the user
    try {

    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: null });
    }
}


export async function postView(req: AuthenticatedRequest, res: Response) {
    // posts a view for the story
    try {
        // when user was watched we are going to add the view
        const story_id = req.body.story_id as number;
        const user_id = await getUserId(req.user?.username || "") as number;
        // let's check story id exists
        const result2 = await prisma.stories.findUnique({
            where: {
                story_id: story_id
            },
            select: {
                user_id: true
            }
        });
        if (!result2?.user_id) {
            res.json({ "message": "story doesn't exists", data: false });
        }
        // let's check is there a view alreadt
        else {
            const result = await prisma.storyViews.findFirst({
                where: {
                    story_id: story_id,
                    user_id: user_id
                }
            });
            if (!result?.viewed_id) {
                const result1 = await prisma.storyViews.create({
                    data: {
                        story_id: story_id,
                        user_id: user_id
                    }
                });
                res.json({ message: "success", data: true });
            } else {
                res.json({ message: "already viewed", data: false });
            }
        }
    } catch (err) {
        console.log(`Error Occured ${err}`);
        res.json({ message: "error occured", data: false });
    }
}