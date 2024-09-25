import User from "../entities/user";

export class FindUserCaseUse {
    async execute(userName: string) {
        try {
            const user = await User.find({ userName: { $regex: new RegExp(userName, 'i') } });
            return user;
        } catch (error) {
            console.error("Erro ao localizar usuário:", error);
            throw new Error("Falha ao encontrar o usuário. Por favor, tente novamente mais tarde.");
        };
    };
};
