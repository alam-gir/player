import { Router } from "express";
import {registerUser} from "../controllers/auth.controller.ts"
import { userValidation } from "../utilities/validation.ts";
import { upload } from "../middlewares/multer.middleware.ts";
const router = Router();

router.route("/register").post( upload.fields([{name: "avatar", maxCount: 1}, {name: "coverImage", maxCount: 1}]),userValidation,registerUser)


export default router;