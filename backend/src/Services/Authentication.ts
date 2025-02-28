import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken' 
const prisma = new PrismaClient() ;

import { Request,Response,NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;  // Adjustable work factor (higher = more secure)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function usernameCheck(req:Request, res:Response, next:NextFunction) {
    try{
        const result = await prisma.profile.findUnique({
            where:{
                username: req.body.username
            }
        }) ;
        if (result) res.json({data: false, message: "username already exists"}) ;
        else next() ;
    }catch(err){
        console.log(`The error was ${err}`) ;
        res.json({data: false, message: "error occured"})
    }
}


export async function authorizationHeader(username: string, user_id: number){
    try{
        return jwt.sign({username: username, user_id: user_id}, process.env.JWT_PASS as string) ;
    }catch(err){
        console.log(`Error in authorization header generation`)
    }
}
