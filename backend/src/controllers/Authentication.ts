import { PrismaClient } from "@prisma/client";
import { authorizationHeader, hashPassword } from "../Services/Authentication";
import { AuthenticatedRequest } from "../types/Profile";
import { Response } from "express";
import bcrypt from "bcrypt";
const prisma = new PrismaClient() ;

export async function signUp(req: AuthenticatedRequest, res:Response) {
    try{
        const mailId = req.body.mailId;
        const password = req.body.password;
        const username = req.body.username ;
        const mobile = req.body.mobile ;
        const location = req.body.location;

        const locationResult = await prisma.location.findFirst({
            where:{
                Country: location.Country,
                State: location.State
            } ,
            select:{
                location_id: true,
            } 
        }) ;

        

        const result = await prisma.profile.create({
            data: {
                mailId: mailId,
                password: await hashPassword(password),
                username: username,
                mobile: mobile,
                location_id: locationResult?.location_id || 1,
                account: "PUBLIC",
                followers: 0,
                following: 1,
                profilePicture: "",
            }
        }) ;

        console.log(`The result for profile for creation ${result}`) ;

        res.json({message: "success", data: true}) ;

    }catch(err){
        console.log(`The error was ${err}`) ;
        res.json({message: "error occured", data: false})
    }
}

export async function signIn(req: AuthenticatedRequest, res:Response){
    try{
        const password = await hashPassword(req.body.password);
        const username = req.body.username ;
        const result = await prisma.profile.findUnique({
            where:{
                username: username,
            },
            select:{
                password: true,
                user_id: true
            }
        }) ;
        if(!result) res.json({message: "user not found", data: null})
        else{
            const isMatch = await bcrypt.compare(req.body.password, result.password ) ;
        if(isMatch) {

            // here we are going to return the authorization header
            
            res.json({message: 'success', data: await authorizationHeader(username, result.user_id)}) ;
        } 
        else res.json({message: "failure", data: null}) ;
        }
    }catch(err){
        console.log(`The error was ${err}`) ;
        res.json({message: "error occured", data: null})
    }
}


export async function forgotPassword(req: AuthenticatedRequest, res:Response){
    try{

    }catch(err){
        console.log(`The error was ${err}`) ;
        res.json({message: "error occured", data: false})
    }
}