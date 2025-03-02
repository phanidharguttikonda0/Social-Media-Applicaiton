import getUserId from "../Services/getUserId";
import { AuthenticatedRequest } from "../types/Profile";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient() ;
export async function getNotifications(req:AuthenticatedRequest, res:Response){
    try{
        const user_id = await getUserId(req.user?.username || "") as number ;
        const notifications = await prisma.notifications.findMany({
            where:{
                user_id: user_id
            },
            select:{
                post:{
                    select:{
                        CDNURL: true
                    }
                },
                post_id: true,
                type: true,
                user_viewed: true,
                sent_user_id: true,
                id: true,
                user:{
                    select:{
                        user_id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        }) ;

        // we need to reverse the notifications array
        let i = 0;
        let j =  notifications.length - 1 ;
        while(j > i){
            const a = notifications[j] ;
            notifications[j] = notifications[i] ;
            notifications[i] = a ;
            j-- ;
            i++ ;
        }

        res.json({message: "successfully fetched the notifications", data: notifications}) ;

    }catch(err){
        console.log(`Error was ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}

export async function deleteNotification(req:AuthenticatedRequest, res:Response){
    try{
        const notification_id = req.body.notification_id as number;
        const user_id = await getUserId(req.user?.username || "") as number ;
        // let's check notification exist or not
        const result = await prisma.notifications.findFirst({
            where:{
                id: notification_id
            },
            select:{
                user_id: true
            }
        }) ;
        if(result?.user_id === user_id){
            const result1 = await prisma.notifications.delete({
                where:{
                    id: notification_id
                }
            }) ;
            res.json({message: 'successfully deleted', data: true}) ;
        }else{
            res.json({message: "this notification not for you to delete", data: false}) ;
        }

    }catch(err){
        console.log(`Error was ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}

export async function searchUsername(req:AuthenticatedRequest,res:Response){
    try{
        const username = req.body.username ;

        const result = await prisma.profile.findMany({
            where:{
                username: {
                    startsWith: username
                }
            },
            select:{
                username: true,
                user_id: true
            }
        }) ;

        res.json({message: "here are usernames", data: result.slice(0,5)}) ; // returning top 5

    }catch(err){
        console.log(`Error was ${err}`) ;
        res.json({message: "error occured", data: null}) ;
    }
}