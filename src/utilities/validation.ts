import {check, body} from 'express-validator'

export const userValidation = [
    check('username',"username is required")
        .notEmpty()
        .isLength({min: 3}).withMessage("username minimum 3 character needed")
        .isLength({max: 20}).withMessage("username character limit max 20"),

    check('fullName',"name is required").notEmpty(),
    
    check('email',"a valid email required").isEmail(),

    check('password',"password is required")
        .notEmpty()
        .isLength({min: 5}).withMessage("password minimum 5 character needed")
        .isLength({max: 20}).withMessage("password character limit max 20"),
] 

export const userLoginDataValidation = [
    check('username',"username or email is required")
        .if(body("email").isEmpty())
        .notEmpty()
        .isLength({min: 3}).withMessage("username minimum 3 character needed")
        .isLength({max: 20}).withMessage("username character limit max 20"),

    check('email',"username or email is required")
        .if(body("username").isEmpty())
        .isEmail(),

    check('password',"password is required")
        .notEmpty()
        .isLength({min: 5}).withMessage("password minimum 5 character needed")
        .isLength({max: 20}).withMessage("password character limit max 20"),
]