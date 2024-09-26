import User from "../entities/user"; 
import { UserType } from "../entities/user";
import bcrypt from 'bcrypt';

export class RegisterUserCaseUse {
    async execute(userData:UserType) {               
        try {
            const user = new User({
                userName: userData.userName,
                email: userData.email,
                password: bcrypt.hashSync(userData.password, 10),
                address:userData.address
            });
            await user.save();
            return user;
        } catch (error:any) {
            //console.error("Erro ao cadastrar usuário:", error);
            throw new Error("Falha ao registrar usuário. Por favor, tente novamente mais tarde.");
        };          
    };
};

