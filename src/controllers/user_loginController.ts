import { Request, Response } from "express";
import bcrypt from "bcrypt"; 
import User from "../models/entities/user";
import { generateToken} from "../service/jwtService";

export class LoginController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Senha incorreta!" });
        };
        const token = generateToken(user.email, user.role);
        return res.status(200).json({
            token,
            user: {
                email: user.email,
                role: user.role,
            },
        });
    };
};
