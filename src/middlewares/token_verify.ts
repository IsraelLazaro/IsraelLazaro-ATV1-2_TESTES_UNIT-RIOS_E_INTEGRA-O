import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../service/jwtService";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido!" });
    };
    try {
        const checkToken = verifyToken(token);
        console.log("Token válido:", checkToken);
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(403).json({ message: "Token inválido!" });
    };
};
