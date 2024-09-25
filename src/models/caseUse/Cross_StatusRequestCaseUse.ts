import { RelationsPet } from '../entities/relations';

interface idPetsData {
    petSuitorId: string;
    myPetId: string;    
};

export class StatusCrossRequestCaseUse {
    async execute(requestData: idPetsData) {
        try {
            const { petSuitorId, myPetId } = requestData;
            const relation = await RelationsPet.findOne({
                $or: [
                    { 'likes.idPet': myPetId, 'crossRequest': { $exists: true } },
                    { 'matchs.idPetSuitor': petSuitorId, 'crossRequest': { $exists: true } }
                ]
            }).exec();
            if (!relation) {
                throw new Error("Nenhuma solicitação de cruzamento encontrada entre os pets.");
            };
            return relation.crossRequest || "Status não disponível";
        } catch (error:any) {
                console.error("Erro ao buscar status de solicitação de cruzamento:", error.message);
                throw new Error(`Falha ao buscar status de solicitação de cruzamento: ${error.message}. Por favor, tente novamente mais tarde.`);
        };
    };
};
