import { RelationsPet, crossStatus } from "../entities/relations";

export class CrossRequesCaseUse {
    async execute(idRelation: string, statusCross: string, petId: string) {
        try {
            if (!Object.values(crossStatus).includes(statusCross as crossStatus)) {
                throw new Error("Status de cruzamento inválido");
            };
            const relation = await RelationsPet.findById(idRelation);
            if (!relation) {
                throw new Error("Relação não encontrada");
            };
            if (!relation.crossRequest && statusCross === crossStatus.accepted) {
                relation.crossRequest = {
                    status: crossStatus.pending,
                    petId: petId
                };
                await relation.save();
                return;
            };
            if (relation.crossRequest && statusCross === crossStatus.accepted) {
                if (relation.crossRequest.petId === petId) {
                    throw new Error("Você já solicitou a troca desse pet");
                }
                relation.crossRequest = {
                    status: crossStatus.accepted,
                    petId: petId
                };
                await relation.save();
                return;
            };
            if (statusCross === crossStatus.rejected) {
                relation.crossRequest = {
                    status: crossStatus.rejected,
                    petId: petId
                };
                await relation.save();
                return;
            };
            throw new Error("Erro ao realizar a operação. Por favor, tente novamente mais tarde!");

        } catch (error:any) {
            console.error("Erro ao processar solicitação de cruzamento:", error.message);
            throw new Error(`Falha ao processar solicitação de cruzamento: ${error.message}. Por favor, tente novamente mais tarde.`);
        };
    };
};
