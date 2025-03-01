import { NotificationType, PrismaClient } from "@prisma/client";
import { usernameCheck } from "./Authentication";
import { searchUsername } from "../controllers/OtherRoutes";
import getUserId from "./getUserId";

const prisma = new PrismaClient() ;

export async function doesAlreadyLiked(user_id: number, post_id: number){
    try{

        const result = await prisma.likes.findFirst({
            where:{
                user_id: user_id,
                post_id: post_id
            }
        }) ;
        if(result) return true ;

        return false;

    }catch(err){
        console.log(`The error during does already liked check was ${err}`)
        return null ;
    }
}





export async function createNotification(sent_user_id: number, post_id: number, notification: NotificationType){

    try{
        let type = "LIKE" ;
        switch(notification){
            case "COMMENT" : type = "COMMENT" ; break;
            case "FOLLOW" : type = "FOLLOW"; break;
            case "PENDING" : type = "PENDING"; break;// when a follow request is sent
        }

        const userId = await prisma.posts.findFirst({
            where:{
                post_id: post_id
            },
            select:{
                user_id: true
            }
        }) ;

        const result = await prisma.notifications.create({
            data:{
                type: type as NotificationType,
                sent_user_id: sent_user_id,
                user_id: userId?.user_id || 0,
                post_id: post_id
            }
        }) ;
        console.log(`The result of create notification was ${result}`) ;
        return true ;
    }catch(err){
        console.log(`The error during create Notification was ${err}`)
        return false ;
    }
}


export async function deleteNotification(sent_user_id: number, post_id: number, notification: NotificationType){

    try{
        let type = "LIKE" ;
        switch(notification){
            case "COMMENT" : type = "COMMENT"; break;
            case "FOLLOW" : type = "FOLLOW"; break;
            case "PENDING" : type = "PENDING"; break;// when a follow request is sent
        }

        const result = await prisma.notifications.deleteMany({
            where:{
                sent_user_id: sent_user_id,
                post_id: post_id,
                type: type as NotificationType,
            }
        }) ;
        console.log(`The result of the delete notification was ${result}`) ;
        if(result.count > 0){
            return true ;
        }else{
            return false;
        }
        

    }catch(err){
        console.log(`The error during delete Notification was ${err}`)
        return false ;
    }

}

export async function getOwnerofPost(post_id: number){
    try{
        const result = await prisma.posts.findUnique({
            where:{
                post_id: post_id
            },
            select:{
                user_id: true,
            }
        }) ;
        return result?.user_id ;
    }catch(err){
        console.log(`Error was ${err}`)
        return null ;
    }
}

export async function getaccountType(user_id: number){
    try{
        const result = await prisma.profile.findUnique({
            where:{
                user_id:user_id
            },
            select:{
                account: true
            }
        }) ;
        return result?.account ;
    }catch(err){
        console.log(`Error was ${err}`)
        return null ;
    }
}

export async function isFollowing(user_id: number, following_user_id: number){
    try{
        const result = await prisma.connections.findFirst({
            where:{
                following_user_id: following_user_id,
                user_id: user_id   
            },
            select:{
                id: true
            }
        }) ;

        return result ;

    }catch(err){
        console.log(`The error was ${err}`) ;
        return null ;
    }
}