import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/Profile";
import { profile } from "../Services/ProfileServices";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../Services/Authentication";

const prisma = new PrismaClient();

export async function getProfile(req: AuthenticatedRequest, res: Response) {
    try {

        // need to return the profile of the user along with the posts
        if (req.body.username) {
            // getting other user details
            const result = await profile(req.body.username, req.user?.username || "", true);
            res.json({ data: result, message: "success" })
        } else {
            // getting his profile details
            const result = await profile(req.user?.username || "", req.user?.username || "", false);
            res.json({ data: result, message: "success" })
        }

    } catch (err) {
        console.log(`The error in the get profile was ${err}`)
        res.json({ data: null, "message": "Error Occured" });
    }
}




export async function editProfile(req: AuthenticatedRequest, res: Response) {
    try {
        // Extracting values from request body
        const { profile: profilePicUrl, name, username, bio } = req.body;

        // If no data is provided, returning early
        if (!profilePicUrl && !name && !username && !bio) {
            res.json({ data: false, message: "Nothing to be updated" });
        }

        else {
            // Collecting the  fields that need to be updated
            const updateData: { [key: string]: any } = {};
            if (name) updateData.name = name;
            if (bio) updateData.bio = bio;
            if (profilePicUrl) updateData.profilePicture = profilePicUrl;
            if (username) updateData.username = username;

            // Updating profile in one query
            await prisma.profile.update({
                where: { username: req.user?.username },
                data: updateData
            });

            res.json({ data: true, message: "Profile updated successfully" });
        }

    } catch (err) {
        console.error(`Error in editProfile: ${err}`);
        res.status(500).json({ data: null, message: "Error occurred" });
    }
}



export async function changePassword(req: AuthenticatedRequest, res: Response) {
    try {

        const newPassoword = req.body.password;

            await prisma.profile.update({
                where: {
                    username: req.user?.username
                },
                data: {
                    password: await hashPassword(newPassoword)
                }
            });
            res.json({ data: true, message: "success" })

    } catch (err) {
        console.log(`The error in the change password was ${err}`)
        res.json({ data: null, "message": "Error Occured" });
    }
}



export async function changeMailId(req: AuthenticatedRequest, res: Response) {
    try {

        const newmailId = req.body.mailId;
        const result = await prisma.profile.update({
            where:{
                username: req.user?.username
            },
            data:{
                mailId: newmailId
            }
        }) ;
        console.log(`The mail id updation result was ${result}`) ;
        res.json({message: "successfully updated mail id", data: true}) ;

    } catch (err) {
        console.log(`The error in the change Mail Id was ${err}`)
        res.json({ data: null, "message": "Error Occured" });
    }
}


export async function setAccountType(req: AuthenticatedRequest, res: Response) {
    try {

        // when it is called changing the account to private if it is public and vice versa

        const user = await prisma.profile.findUnique({
            where: { username: req.user?.username },
            select: { account: true }
        });

        if (!user) {
            console.log("User not found!");
            res.json({ data: false, message: "user not found" });
        }


        else {

            const newAccountStatus = user.account === "PRIVATE" ? "PUBLIC" : "PRIVATE";


            const updatedUser = await prisma.profile.update({
                where: { username: req.user?.username },
                data: { account: newAccountStatus },
                select: { username: true, account: true }
            });

            console.log(`Updated account status: ${updatedUser.account}`);

            res.json({ data: true, message: "done successfully" })


        }


    } catch (err) {
        console.log(`The error in the account type was ${err}`)
        res.json({ data: null, "message": "Error Occured" });
    }
}
