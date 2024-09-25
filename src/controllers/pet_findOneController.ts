import { Request, Response } from "express";
import { FindOnePetCaseUse } from "../models/caseUse/Pet_FindOneCaseUse";

export class FindOnePetController{
    async handle(req: Request, res: Response){
        const { id } = req.params;
        const caseUse = new FindOnePetCaseUse();
        const pet = await caseUse.execute(id);
        return res.status(200).json(pet);
    };
};