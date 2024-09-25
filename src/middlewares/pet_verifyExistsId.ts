import { Request, Response, NextFunction } from 'express';
import PetsModel from '../models/entities/pets';

const verifyExistsIdPet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID Necessário para realizar a função desejada!' });
    };
    const pet = await PetsModel.findById(id);
    if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado no sistema!' });
    };
    next();
};

export default verifyExistsIdPet;
