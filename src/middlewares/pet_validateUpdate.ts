import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validateUpdatePetData = (req: Request, res: Response, next: NextFunction) => {
    const petSchema = Joi.object({
        name: Joi.string().min(3).optional(),
        age: Joi.number().min(0).optional(),
        species: Joi.string().optional(),
        breed: Joi.string().optional(),
        weight: Joi.number().min(0).optional(),
        size: Joi.number().min(0).optional(),
    });
    const { error } = petSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    };
    next();
};

export default validateUpdatePetData;
