import { Request, Response, NextFunction } from 'express';
import User from '../models/entities/user';

const verifyExistsIdUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "ID é necessário para deletar o usuário." });
    };
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    };
    next(); 
};

export default verifyExistsIdUser;