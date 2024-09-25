import User from "../entities/user";

export class DeleteUserCaseUse {    
    async execute(id: string): Promise<void> {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado no sistema!');
        };
        try {
            await user.deleteOne();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw new Error('Falha ao deletar o usuário. Por favor, tente novamente mais tarde.');            
        };     
    };
};
