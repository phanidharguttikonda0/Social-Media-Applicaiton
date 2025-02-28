import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";

export async function createStory(req: AuthenticatedRequest, res: Response){}


export async function getViews(req: AuthenticatedRequest, res: Response) {}


export async function getViewsCount(req: AuthenticatedRequest, res: Response){}


export async function deleteStory(req: AuthenticatedRequest, res: Response){}


export async function getStories(req: AuthenticatedRequest, res:Response){
    // returns all the stories of the followers along with their profile pic and username
    // returns all the stories of the user
}


export async function postView(req: AuthenticatedRequest, res: Response){
    // posts a view for the story
}