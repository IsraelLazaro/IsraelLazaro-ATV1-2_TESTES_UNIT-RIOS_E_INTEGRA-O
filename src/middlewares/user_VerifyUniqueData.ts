import { Request, Response, NextFunction } from 'express';
import User from '../models/entities/user';

const VerifyUniqueData = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, cpf, phone } = req.body;
    const userId = req.params.id; 
    if (userName) {
        const existingUser = await User.findOne({ userName });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Username já existe." });
        };
    };
    if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ message: "Email já cadastrado no sistema." });
        };
    };
    if (cpf) {
        const existingCpf = await User.findOne({ cpf });
        if (existingCpf && existingCpf._id.toString() !== userId) {
            return res.status(400).json({ message: "CPF já cadastrado no sistema." });
        };
    };
    if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone && existingPhone._id.toString() !== userId) {
            return res.status(400).json({ message: "Telefone já cadastrado no sistema." });
        };
    };    
    next();
};

export default VerifyUniqueData;
