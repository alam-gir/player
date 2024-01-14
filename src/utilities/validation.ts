import {check} from 'express-validator'

export const userValidation = [
    check('username',"username is required").notEmpty(),
    check('fullName',"name is required").notEmpty(),
    check('email',"a valid email required").notEmpty(),
    check('password',"password is required").notEmpty(),
] 