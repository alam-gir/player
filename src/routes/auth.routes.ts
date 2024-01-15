import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/auth.controller.ts"
import { userLoginDataValidation, userValidation } from "../utilities/validation.ts";
import { upload } from "../middlewares/multer.middleware.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
const router = Router();

router.route("/register").post( upload.fields([{name: "avatar", maxCount: 1}, {name: "coverImage", maxCount: 1}]), userValidation,registerUser);
router.route("/login").post( userLoginDataValidation, loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;