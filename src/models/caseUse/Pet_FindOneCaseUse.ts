import PetsModel from "../entities/pets";

export class FindOnePetCaseUse {
    async execute(id: string) {
        try {
            const pet = await PetsModel.findById(id);            
            if (!pet) {
                throw new Error("Pet não encontrado no sistema!");
            };
            return pet;
        } catch (error) {
            console.error("Erro ao encontrar pet:", error);
            throw new Error("Falha ao encontrar Pet. Por favor, tente novamente mais tarde.");
        };
    };
};
