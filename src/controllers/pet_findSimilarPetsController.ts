import { Request, Response } from "express";
import FindSimilarPetsCaseUse from "../models/caseUse/Pet_FindSimilarPetsCaseUse";

export class FindSimilarPetsController{
    async handle(req: Request, res: Response){
        const pet = req.body;
        const {id} = res.locals.user;
        const caseUse = new FindSimilarPetsCaseUse();       
        const pets = await caseUse.execute(id, pet);
        res.status(200).json(pets);
    };
};