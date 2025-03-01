import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient() ;

export default async function getUserId(username:string){
    try{

        const result = await prisma.profile.findUnique({
            where:{
                username: username
            },
            select:{
                user_id: true,
            }
        }) ;

        return result?.user_id ;

    }catch(err){
        console.log(`Error Occured while getting the user Id ${err}`)
        return null ;
    }
}