import PetsModel from "../entities/pets";
import { PetType } from "../entities/pets";

export class UpdatePetCaseUse {
    async execute(id: string, data: PetType) {
        try {
            const pet = await PetsModel.findById(id);
            if (!pet) {
                throw new Error("Pet não encontrado no sistema!");
            }
            for (const [key, value] of Object.entries(data)) {
                switch (key) {
                    case 'name':
                        pet.name = value;
                        break;
                    case 'age':
                        pet.age = value;
                        break;
                    case 'species':
                        pet.specie = value;
                        break;
                    case 'breed':
                        pet.breed = value;
                        break;
                    case 'weight':
                        pet.weight = value;
                        break;
                    case 'size':
                        pet.size = value;
                        break;
                };
            };
            await pet.save();     
            const updatedPet = {
                name: pet.name,
                age: pet.age,
                species: pet?.specie,
            };
            return updatedPet;
        } catch (error) {
            console.error("Erro ao atualizar o pet:", error);
            throw new Error("Falha ao atualizar o Pet. Por favor, tente novamente mais tarde.");
        };
    };
};
