import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken' ;
import { AuthenticatedRequest } from "../types/Profile";




const password:string = process.env.JWT_PASS as string;


export async function AuthorizationCheck(req:AuthenticatedRequest,res:Response,next:NextFunction): Promise<void>{
    try{
        const decoded = jwt.verify(req.headers['authorization'] as string, password) as {username: string; [key: string]:any} ;
        if(decoded.username !== null && decoded.username !== undefined) req.user = decoded ;
        next() ;
    }catch(err){
        console.log(`The error in the autorization middle ware was ${err}`)
        res.json({"message": "invalid authorization header", value: 'false'})
    }
}