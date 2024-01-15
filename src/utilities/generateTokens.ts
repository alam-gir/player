import { userModel } from "../models/user.model";

export const generateTokens = async(userId : string) => {
    try {
        // get the user
        const user = await userModel.findOne({_id: userId});
        const accessToken = user?.generateAccessToken();
        const refreshToken = user?.generateRefreshToken();
        const refresTokenUpdaed = await userModel.updateOne({_id: userId},{$set:{refreshToken}});
        console.log({refresTokenUpdaed})
        return {
            accessToken, refreshToken
        }
    } catch (error) {
        console.log(error)
        return null
    }

}