import { Request, Response } from "express";

const registerUser = (req: Request, res : Response) => {
    res.json({"oke" : "ok"});
}


export {
    registerUser
}