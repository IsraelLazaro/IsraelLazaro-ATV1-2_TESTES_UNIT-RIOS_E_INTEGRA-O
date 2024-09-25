import { Request, Response } from "express";
import { CrossRequesCaseUse } from "../models/caseUse/Cross_RequestCaseUse";

export class CrossRequestController{
    async handle(req: Request, res: Response){
        const { id } = req.params;
        const {statusCross, petId} = req.body;
        const crossRequestCaseUse = new CrossRequesCaseUse();
        const result = await crossRequestCaseUse.execute(id, statusCross, petId);
        return res.status(201).json(result);
    };
};