import PetsModel from '../entities/pets';
import { RelationsPet, crossStatus } from '../entities/relations';
import { VerifyLikesPets } from './Pet_VerifyLikesCaseUse';

interface RelationPet {
    pet_id: string;
    myPet_id: string;
};

export class LikedPetCaseUse {
    async execute(relationData: RelationPet): Promise<object> {
        const idPetSuitor = relationData.pet_id;
        const idMyPet = relationData.myPet_id;
        const suitorPet = await PetsModel.findById(idPetSuitor);
        const myPet = await PetsModel.findById(idMyPet);
        if (!suitorPet || !myPet) {
            throw new Error("Pet não encontrado no sistema!");
        };
        const relationsSuitorPet = suitorPet.relations || [];
        const relationsMyPet = myPet.relations || [];
        const verifyLike = new VerifyLikesPets();
        const likedMypet = await verifyLike.execute(relationsMyPet, idPetSuitor);
        const myPetliked = await verifyLike.execute(relationsSuitorPet, idMyPet);
        if (!myPetliked && !likedMypet) {
            try {
                const relationPet = new RelationsPet();
                relationPet.likes = { idPet: idMyPet };                
                await relationPet.save(); 
                suitorPet.relations?.push(relationPet._id);
                await suitorPet.save();
                return relationPet;
            } catch (error) {
                console.error('Erro ao criar relação:', error);
                throw new Error(`Falha ao criar relacionamento match para os pets ${idPetSuitor} e ${idMyPet}. Por favor, tente novamente mais tarde.`);
            };
        };
        if (myPetliked && !likedMypet) {
            throw new Error("O pet selecionado já possui o relacionamento like!");
        };
        if (likedMypet && !myPetliked) {
            try {
                const match = {
                    idPetSuitor: idPetSuitor,
                    idMyPet: idMyPet
                };
                const likedMyPetRelation = likedMypet.relationDocument;
                const relationId = likedMyPetRelation._id;                
                myPet.relations = myPet.relations?.filter(id => !id.equals(relationId));
                await myPet.save();
                await likedMyPetRelation.deleteOne();                
                const relationPet = new RelationsPet();
                relationPet.matchs = match;               
                await relationPet.save(); 
                myPet.relations?.push(relationPet._id);
                suitorPet.relations?.push(relationPet._id);
                await myPet.save();
                await suitorPet.save();                
                return { relationPet};
            } catch (error) {
                console.error('Erro ao criar relacionamento match:', error);
                throw new Error(`Falha ao criar relacionamento match para os pets ${idPetSuitor} e ${idMyPet}. Por favor, tente novamente mais tarde.`);
            };
        };
        throw new Error("Erro ao criar relacionamento like!");
    };
};
