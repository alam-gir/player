import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { userModel } from "../models/user.model";
import { uploadImageToCloudinary } from "../lib/clodinary.ts";
import fs from 'fs';


const registerUser = async(req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(401).json(errors)
    const {fullName, username, email, password} = req.body;
    
    try {
        const isExist = await userModel.findOne({$or:[{email}, {username}]});
        // @ts-ignore
        const avatarPath  = req.files?.avatar[0]?.path
        //@ts-ignore
        const coverImagePath = req.files?.coverImage[0]?.path || ""

        if(isExist) {
            // ulink uploaded files
            fs.unlinkSync(avatarPath);
            fs.unlinkSync(coverImagePath);
            return res.status(409).json({message: "user already exist"});
        }

        // upload avatar and cover image to cloudinary

        const avatarRes = await uploadImageToCloudinary(avatarPath, 'play/avatar');
        const coverImageRes = await uploadImageToCloudinary(coverImagePath, 'play/coverImage');
        
        const newUser = await userModel.create({
            fullName, 
            email, 
            username, 
            password, 
            avatar: avatarRes?.url, 
            coverImage: coverImageRes?.url
        });
        
         if(!newUser) return res.status(401).json({message: "error while creating the user"});
    
        res.status(200).json({
            message: "successfuly registered user.",
        })

    } catch (error ) {
        res.status(500).json({error})
    }
}


export {
    registerUser
}