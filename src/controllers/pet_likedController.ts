import { Request, Response } from "express";
import { LikedPetCaseUse } from "../models/caseUse/Pet_LikedCaseUse";

export class LikedPetController{
    async handle(req: Request, res: Response){
        const idPetData = req.body;
        const likedPetCaseUse = new LikedPetCaseUse();
        const result = await likedPetCaseUse.execute(idPetData);
        return res.status(201).json(result);  
    };
};