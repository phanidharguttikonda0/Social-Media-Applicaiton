import { NextFunction , Request, Response} from 'express';
import {z} from 'zod' ;
import { AuthenticatedRequest } from '../types/Profile';

const passwordSchema = z.string().min(8).max(24) ;
const mailSchema = z.string().email() ;
const usernameSchema = z.string().regex(/^[a-zA-Z_]+[a-zA-Z_0-9]+$/)
const mobileSchema = z.string().regex(/^[6-9]+[0-9]{9}$/) ;

export async function passwordValidation(req:AuthenticatedRequest, res:Response, next:NextFunction){
    if(passwordSchema.safeParse(req.body.password).success){
        next() ;
    }else res.json({data: false, message: "invalid password"})
}


export async function mailIdValidation(req:AuthenticatedRequest, res:Response, next:NextFunction){
    if(mailSchema.safeParse(req.body.mailId).success) next() ;
    else res.json({message: "invalid mail id", data: false}) ;
}

export async function mobileValidation(req:AuthenticatedRequest, res:Response, next:NextFunction){
    console.log(`The request was ${req}`)
    if(mobileSchema.safeParse(req.body.mobile).success) next() ;
    else res.json({message: "invalid mobile number", data: false}) ;
}

export async function usernameValidation(req:AuthenticatedRequest, res:Response, next:NextFunction){ 
    if(usernameSchema.safeParse(req.body.username).success) next() ;
    else res.json({message: "invalid username", data: false}) ;
}


export async function nameValidation(req:AuthenticatedRequest, res:Response, next:NextFunction){
    const nameSchema = z.string().regex(/^[a-zA-Z]$/) ;
    if(nameSchema.safeParse(req.body.name).success){
        next() ;
    }else res.json({message: "name should only contain characters", data: false}) ;
}