import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";
import getUserId from "../Services/getUserId";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() ;

export async function createStory(req: AuthenticatedRequest, res: Response){

    try{
        const user_id = await getUserId(req.user?.username || "") as number;
        const url = req.body.url ;
        const type = req.body.type ;
        const result = await prisma.stories.create({
            data:{
                CDNURL: url,
                type: type,
                user_id: user_id,
            }
        }) ;
        res.json({message: "successfully created story", data:true}) ;
    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }

}


export async function getViews(req: AuthenticatedRequest, res: Response) {
    try{
        const story_id = req.body.story_id ;
        const result1 = await prisma.stories.findFirst({
            where:{
                story_id: story_id
            },
            select:{
                user_id: true,
            }
        }) ;
        const user_id = await getUserId(req.user?.username || "") as number ;
        if(user_id === result1?.user_id){
            const result = await prisma.storyViews.findMany({
                where:{
                    story_id: story_id
                },
                select:{
                    user:{
                        select:{
                           user_id: true,
                           username: true,
                           profilePicture: true 
                        }
                    }
                }
            }) ;
            console.log(`result was ${result}`) ;
            res.json({message: "success", data: result}) ;
        }else{
            res.json({message: "unauthorized access not an owner", data: null}) ;
        }
    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}


export async function getViewsCount(req: AuthenticatedRequest, res: Response){
    try{
        // there is no need to views count as getViews return an array of users
        // that length will be views count
    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}


export async function deleteStory(req: AuthenticatedRequest, res: Response){
    try{

    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}


export async function getStories(req: AuthenticatedRequest, res:Response){
    // returns all the stories of the followers along with their profile pic and username
    // returns all the stories of the user
    try{

    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}


export async function postView(req: AuthenticatedRequest, res: Response){
    // posts a view for the story
    try{

    }catch(err){
        console.log(`Error Occured ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}