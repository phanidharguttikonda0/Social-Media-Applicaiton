import { PrismaClient } from "@prisma/client";
import { Profile } from "../types/Profile";
import { number } from "zod";
import { NextFunction } from "express";

const prisma = new PrismaClient({log: [
    'info', 'query'
]});

export async function profile(username: string, requestedUser:string, others: boolean) { // if others is true means other user profile we are getting
    try {
        
        // get user profile with out password
        const result = await prisma.profile.findUnique({
            where:{
                username
            },
            select:{
                user_id: true,
                username: true,
                mailId: others? false: true,
                mobile: others? false: true,
                bio: true,
                name: true,
                account: true,
                followers: true,
                following: true,
                Posts: true,
                location_id: true,
                profilePicture: true,
            }
        }) ;

        const locationResult = await prisma.location.findUnique({
            where:{
                location_id: result?.location_id
            }
        }) ;

        
        let following = false;

        // check whether the req.user.username is following him or not
        if(requestedUser !== username && result?.account === "PRIVATE"){
            
            const result2 = await prisma.profile.findUnique({
                where:{
                    username: requestedUser
                },
                select:{
                    user_id: true
                }
            })

            const resultData = await prisma.connections.findFirst({
                where:{
                    user_id: result2?.user_id,
                    following_user_id: result?.user_id ,
                }
            }) ;

            if(resultData !== null){
                // hence following
                following = true ;
            }


        }

        const modifiedResult = {
            ...result,
            Posts: result?.account === "PRIVATE" ? following? result?.Posts: null : result?.Posts,
            location: locationResult,
        }

        console.log(`The Result for profile was ${modifiedResult}`) ;
        return modifiedResult ;
      
    } catch (err) {
      console.log(`Error occurred in username check: ${err}`);
      return null;
    }
  }





  