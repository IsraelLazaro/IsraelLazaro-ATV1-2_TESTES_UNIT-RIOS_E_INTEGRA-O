import PetsModel from "../entities/pets";
import { RelationsPet } from "../entities/relations";

export class DeletePetCaseUse {
    async execute(id: string) {
        try {
            const pet = await PetsModel.findById(id);            
            if (!pet) {
                throw new Error("Pet não encontrado no sistema!");
            };
            const listRelation = pet.relations;        
            if (listRelation && listRelation.length > 0) {
                for (const relation of listRelation) {
                    const relationDocument = await RelationsPet.findById(relation).exec();                 
                    if (relationDocument) {
                        await relationDocument.deleteOne();
                    };
                };
            };
            await pet.deleteOne();  
            return "Pet e suas relações foram deletados com sucesso!";
            
        } catch (error) {
            console.error("Erro ao excluir o pet e suas relações:", error);
            throw new Error("Falha ao deletar o pet. Por favor, tente novamente mais tarde.");
        };
    };
};