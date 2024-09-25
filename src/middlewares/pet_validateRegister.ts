import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validateRegisterPet = (req: Request, res: Response, next: NextFunction) => {
    const petSchema = Joi.object({
        pets: Joi.array().items(
            Joi.object({
                name: Joi.string().min(3).required(),
                age: Joi.number().min(0).required(),
                specie: Joi.string().required(),
                breed: Joi.string().required(),
                weight: Joi.number().optional(),
                size: Joi.number().optional(),
                photos: Joi.array().items(Joi.string()).optional(),
            })
        ).required(),
    });
    const { error } = petSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    };
    next();
};

export default validateRegisterPet;
