import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: "dugc533jq",
    api_key: "911967824621894",
    api_secret: "EBzOzyWl2UfNguHh9CGqxfC4U2k",
})

export const uploadImageToCloudinary = async (imagePath : string, folder : string) => {
    if(!imagePath) return null;

    try {
        const response = await cloudinary.uploader.upload(imagePath,{
            folder,
            resource_type: 'image'
        })

        console.log({imagePath})
        fs.unlinkSync(imagePath);

        return {
            public_id: response.public_id,
            url : response.secure_url
        }
    } catch (error) {
        fs.unlinkSync(imagePath);
        console.log(error)
        return null;
    }
}