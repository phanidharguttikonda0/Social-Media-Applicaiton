import { PrismaClient } from "@prisma/client";
import { getaccountType, isFollowing } from "./Posts";

const prisma =  new PrismaClient() ;




export async function getUserIdbyStoryId(storyId: number){
    try{
        
        const result = await prisma.stories.findUnique({
            where:{
                story_id: storyId
            },
            select:{
                user_id: true,          
            }
        }) ;
        return result?.user_id ;
    }catch(err){
        console.log(`Error was ${err}`) ;
        return -1;
    }

}

export async function isUserValid(userId: number, storyId: number){

    try{
        const owner_id = await getUserIdbyStoryId(storyId) as number;
        if(owner_id === -1) return false ;
        const accountType = await getaccountType(owner_id) ;
        if(accountType === "PRIVATE"){
            // know we need to check whether the user is following or not
            const result = await isFollowing(userId, owner_id) ;
            if(result) return true;
            else return false ;
        }
        else return true;
    }catch(err){
        console.log(`Error was ${err}`) ;
        return false;
    }


}