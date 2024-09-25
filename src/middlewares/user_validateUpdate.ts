import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validateUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    const addressSchema = Joi.object({
        city: Joi.string().required(),
        state: Joi.string().required(),
        location: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required()
        }).required()
    });
    const schema = Joi.object({
        name: Joi.string().optional(),
        userName: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        cpf: Joi.string()
            .length(14)
            .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/) 
            .optional(),
        phone: Joi.string()
            .length(15)
            .pattern(/^\(\d{2}\) \d{5}-\d{4}$/) 
            .optional(),
        address: addressSchema.optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    };
    next();
};

export default validateUpdateUser;
