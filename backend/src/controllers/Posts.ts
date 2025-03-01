import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";
import getUserId from "../Services/getUserId";
import { PrismaClient } from "@prisma/client";
import { createNotification, deleteNotification, doesAlreadyLiked, getaccountType, getOwnerofPost, isFollowing } from "../Services/Posts";

const prisma = new PrismaClient();

export async function createPost(req: AuthenticatedRequest, res: Response) {
    try {
        // we need url of the image, post bio, type of the post
        const typeOfPost = req.body.type;
        const url = req.body.url;
        const bio = req.body.bio;
        // here we are not asking the user to send user id due to security , we will fetch the user id based on
        // the username that we got from the authorization header
        const user_id = await getUserId(req.user?.username || "");

        if (user_id === null) res.json({ "message": "no user found", data: false });
        else {
            const result = await prisma.posts.create({
                data: {
                    CDNURL: url,
                    totalLikes: 0,
                    user_id: user_id as number,
                    type: typeOfPost,
                    post_bio: bio,
                }
            });
            console.log(`The post creation result was ${result}`);
            res.json({ message: "successfully posted", data: result });
        }

    } catch (err) {
        console.log(`The error in the post creation was ${err}`)
        res.json({ message: "error occured", data: null });
    }
}


export async function deletePost(req: AuthenticatedRequest, res: Response) {
    // if post is deleted all the comments and the likes history are gonna deleted
    try {

        const post_id = req.body.post_id;
        // let's check whether he is the owner of the post or not
        const result = await prisma.posts.findUnique({
            where: {
                post_id: post_id,
            },
            select: {
                user: {
                    select: { username: true }
                }
            }
        });
        if (result?.user.username === req.user?.username) {

            // know over here we need to delete all the likes and comments list of the post as well
            // as in the schema we mentions onDelete Cascade when we delete post automatically those
            // children also get's deleted

            const result = await prisma.posts.delete({
                where: {
                    post_id: post_id
                }
            });

            console.log(`after deletion of the post the result was ${result}`);
            res.json({ message: "successfully deleted the post", data: true });

        } else {
            res.json({ "message": "only owner can delete the post", data: false });
        }

    } catch (err) {
        console.log(`The error in the delete post was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}





export async function postLike(req: AuthenticatedRequest, res: Response) {
    try {
        const post_id = req.body.post_id as number;
        const user_id = await getUserId(req.user?.username || "") as number;

        await prisma.$transaction(async (prisma) => {
            // Try deleting the like (if exists)
            const deleteLikeResult = await prisma.likes.deleteMany({
                where: {
                    post_id: post_id,
                    user_id: user_id
                }
            });

            if (deleteLikeResult.count > 0) {
                // Like existed and was deleted, now delete notification
                await deleteNotification(user_id, post_id, "LIKE");

                res.json({ message: "Successfully removed the like", data: true });
            } else {
                // Like did not exist, so create a new like
                await prisma.likes.create({
                    data: {
                        user_id: user_id,
                        post_id: post_id
                    }
                });

                const userId = await prisma.posts.findFirst({
                    where: {
                        post_id: post_id
                    },
                    select: {
                        user_id: true
                    }
                });

                // Create a new notification
                await createNotification(user_id, post_id, "LIKE");

                res.json({ message: "Successfully liked the post", data: true });
            }
        });
    } catch (err) {
        console.error(`Transaction failed: ${err}`);
        res.json({ message: "An error occurred", data: false });
    }
}


export async function postComment(req: AuthenticatedRequest, res: Response) {
    // adds the comment to the post
    try {

        const comment = req.body.comment;
        const post_id = req.body.post_id;

        // know we are going to add the comment to the post




        await prisma.$transaction(async (prisma) => {
            const user_id = await getUserId(req.user?.username || "") as number;


            const result = await prisma.comments.create({
                data: {
                    comment: comment,
                    post_id: post_id,
                    user_id: user_id as number
                }
            });

            // know creating a notification as well
            const success = await createNotification(user_id, post_id, "COMMENT");
            if (!success) {
                throw new Error("Notification creation failed, rolling back transaction.");
            }

            res.json({ message: "posted a comment successfully", data: true });

        });



    } catch (err) {
        console.log(`The error in the post comment was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response) {
    // delete the specific comment of the post
    // post owner can delete any comment he wants
    try {

        const commentId = req.body.commentId as number;
        const post_id = req.body.post_id;

        await prisma.$transaction(async (prisma) => {

            // we need to delete notification and then comment
            const userId = await getUserId(req.user?.username || "") as number;

            // we need to check whether the request sent by owner of the comment or owner of the post

            const result1 = await prisma.comments.findFirst({
                where: {
                    comment_id: commentId
                },
                select: {
                    user_id: true,
                }
            });

            let authorized = false ;
            if (result1?.user_id !== userId) {

                // check it it is owner of the post
                const result12 = await prisma.posts.findUnique({
                    where:{
                        post_id: post_id
                    },
                    select:{
                        user: {
                            select:{
                                user_id: true
                            }
                        }
                    }
                }) ;

                if(userId === result12?.user.user_id) authorized = true ;

                
            }else{
                authorized = true ;
            }

            

            if(authorized){
                const result = await deleteNotification(userId, post_id, "COMMENT");

                if (!result) {
                    throw new Error("Notification deletion failed, rolling back transaction.");
                }

                const result2 = await prisma.comments.delete({
                    where: {
                        comment_id: commentId
                    }
                });

                if (!result2) {
                    throw new Error("deleting comment failed, rolling back transaction.");
                }

                res.json({ message: "success fully deleted the comment", data: true });
            }else{
                res.json({ message: "unauthorized user", data: false })
            }


        })


    } catch (err) {
        console.log(`The error in the delete comment was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}


export async function getComments(req: AuthenticatedRequest, res: Response) {
    try {

        // here we need to check whether the user was following the user or not in case the owner was private account
        // if following if the owner was private account then we can allow to get the comments
        // we write this logic for getting likes, getting posts, getting stories , so let's 
        // write this logic check in a seperate Service file
        const post_id = req.body.post_id as number;
        const postOwnerId =  await getOwnerofPost(post_id) as number;
        const accountType = await getaccountType(postOwnerId) ;
        let allow = true ;
        if(accountType !== "PUBLIC"){
            // we need to check for the following
            const result = await isFollowing(await getUserId(req.user?.username || "") as number, postOwnerId) ;
            if(!result?.id){
                allow = false;
            }
        }
        if(allow){
            // we are going to return comments
            const result = await prisma.comments.findMany({
                where:{
                    post_id: post_id
                },
                select:{
                    comment: true,
                    user: {
                        select:{
                            profilePicture: true,
                            username: true,
                            user_id: true
                        }
                    },
                    created_time: true
                }
            }) ;
            res.json({message: "success", data: result}) ;

        }else{
            res.json({message: "you will not get comments user is private", data: false}) ;
        }

    } catch (err) {
        console.log(`The error in the get commentswas ${err}`)
        res.json({ message: "error occured", data: false });
    }
}


export async function getLikes(req: AuthenticatedRequest, res: Response) {
    try {
        const post_id = req.body.post_id as number;
        const postOwnerId =  await getOwnerofPost(post_id) as number;
        const accountType = await getaccountType(postOwnerId) ;
        let allow = true ;
        if(accountType !== "PUBLIC"){
            // we need to check for the following
            const result = await isFollowing(await getUserId(req.user?.username || "") as number, postOwnerId) ;
            if(!result?.id){
                allow = false;
            }
        }

        if(allow){
            // returning the liked users
            const result = await prisma.likes.findMany({
                where:{
                    post_id: post_id
                },
                select:{
                    user: {
                        select:{
                            username: true,
                            profilePicture: true,
                            user_id: true
                        }
                    }
                }
            }) ;
            res.json({message: "success", data: result}) ;
        }else{
            res.json({message: "you will not get comments user is private", data: false}) ;
        }

    } catch (err) {
        console.log(`The error in the get Likes was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}


export async function getPosts(req: AuthenticatedRequest, res: Response) {
    // here returns the list of latest posts of first 12 posts for the user he is following
    try {

        // firstly get the following list and their latest posts


    } catch (err) {
        console.log(`The error in the get post was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}



export async function getReels(req: AuthenticatedRequest, res: Response) {
    // we are going to return the posts that are type of VIDEO
    try {
        // here we are going to get the reels for the user , may be some random reels
    } catch (err) {
        console.log(`The error in the get reels was ${err}`)
        res.json({ message: "error occured", data: false });
    }
}