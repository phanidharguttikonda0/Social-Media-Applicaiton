import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";


export async function createPost(req: AuthenticatedRequest, res: Response){}


export async function deletePost(req: AuthenticatedRequest, res: Response){
    // if post is deleted all the comments and the likes history are gonna deleted
}


export async function getPosts(req: AuthenticatedRequest, res: Response){
    // here returns the list of latest posts of first 12 posts for the user he is following
}



export async function postLike(req: AuthenticatedRequest, res: Response){
    // when user likes , if he was not in the likes list of the post , then added to likes
    // else removed from the likes 
}

export async function postComment(req: AuthenticatedRequest, res: Response) {
    // adds the comment to the post
}

export async function deleteComment(req: AuthenticatedRequest, res: Response){
    // delete the specific comment of the post
    // post owner can delete any comment he wants
}


export async function getComments(req: AuthenticatedRequest, res: Response){
    
}


export async function getLikes(req:AuthenticatedRequest, res: Response){

}


export async function getReels(req:AuthenticatedRequest, res:Response){
    // we are going to return the posts that are type of VIDEO
}