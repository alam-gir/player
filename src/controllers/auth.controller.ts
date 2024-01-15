import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { userModel } from "../models/user.model";
import { uploadImageToCloudinary } from "../lib/clodinary.ts";
import fs, { existsSync } from "fs";
import { generateTokens } from "../utilities/generateTokens.ts";
import { IGetUserInterfaceRequst } from "../../@types/custom";

const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(401).json(errors);
  const { fullName, username, email, password } = req.body;

  try {
    const isExist = await userModel.findOne({ $or: [{ email }, { username }] });
    // @ts-ignore
    const avatarPath = req.files?.avatar[0]?.path;
    //@ts-ignore
    const coverImagePath = req.files?.coverImage[0]?.path || "";

    if (isExist) {
      // ulink uploaded files
      fs.unlinkSync(avatarPath);
      fs.unlinkSync(coverImagePath);
      return res.status(409).json({ message: "user already exist" });
    }

    // upload avatar and cover image to cloudinary

    const avatarRes = await uploadImageToCloudinary(avatarPath, "play/avatar");
    const coverImageRes = await uploadImageToCloudinary(
      coverImagePath,
      "play/coverImage"
    );

    const newUser = await userModel.create({
      fullName,
      email,
      username,
      password,
      avatar: avatarRes?.url,
      coverImage: coverImageRes?.url,
    });

    if (!newUser)
      return res.status(401).json({ message: "error while creating the user" });

    res.status(200).json({
      message: "successfuly registered user.",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const loginUser = async (req: Request, res: Response) => {
  // parse data from body,
  // check data validity
  // check user exist or not
  // check password correct or not
  // generate token
  // set refresh tokento DB
  // set cookie access token and refresh token both,
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(401).json(errors);
  try {
    const { email, password, username } = matchedData(req);

    const existUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!existUser)
      return res.status(404).json({
        message: "this email or user name does not have any account!",
      });

    const isValidPassword = await existUser.isPasswordValid(password);

    if (!isValidPassword)
      return res.status(404).json({ message: "user credential is wrong!" });

    const tokens = await generateTokens(existUser._id);

    if (!tokens?.accessToken && tokens?.refreshToken)
      return res.status(401).json({ message: "failed to generate tokens" });

    res.cookie("accessToken", tokens?.accessToken, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      maxAge: 5 * 1000 * 60,
      httpOnly: true,
      sameSite: true,
      secure: true
    });
    res.cookie("refreshToken", tokens?.refreshToken, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: true,
      secure: true
    });
    const userData = {
      fullName: existUser.fullName,
      email: existUser.email,
      username: existUser.username,
      avatar: existUser.avatar,
      coverImage: existUser.coverImage,
    };
    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const logoutUser = async (req: IGetUserInterfaceRequst, res: Response) => {
  // finduser and unsetrefresh token
  // clear cookis, accesstoken refreshtoken
  try {
    const userId = req.user?._id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
      })
      .clearCookie("refreshToken", { httpOnly: true, secure: true });

    return res.status(200).json({ message: "Logout user successfully." });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export { registerUser, loginUser, logoutUser };
