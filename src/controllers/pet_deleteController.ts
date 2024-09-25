import { Request, Response } from "express";
import { DeletePetCaseUse } from "../models/caseUse/Pet_DeleteCaseUse";

export class DeletePetController{
    async handle(req: Request, res: Response){
        const { id } = req.params;          
            const  deletePetCaseUse = new DeletePetCaseUse();
            const result = await deletePetCaseUse.execute(id);
            return res.status(200).json(result);
    };
};