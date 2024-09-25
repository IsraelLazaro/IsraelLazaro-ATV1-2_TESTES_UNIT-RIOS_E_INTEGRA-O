import { Request, Response } from "express";
import { UpdatePetCaseUse } from "../models/caseUse/Pet_UpdateCaseUse";

export class UpdatePetController{
    async handle(req: Request, res: Response){
        const { id } = req.params;
        const updatePetData = req.body;
        const updateCaseUse = new UpdatePetCaseUse();
        const petUpdate = await updateCaseUse.execute(id, updatePetData);
        return res.status(200).json(petUpdate);
    };
};