import PetsModel from "../entities/pets";
import { PetType } from "../entities/pets";
import User from "../entities/user";
import { Types } from "mongoose";

interface UserPet {
    pets: PetType[];
};

export class RegisterPetCaseUse {
    async execute(userId: string, addPet: UserPet) {
        try {
            if (!Types.ObjectId.isValid(userId)) {
                throw new Error("Id inválido");
            };
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("Usuário não encontrado");
            };
            if (!user.pets) {
                user.pets = [];
            };
            const petsToSave = await Promise.all(

                addPet.pets.map(petData => new PetsModel(petData).save())
            );
            const petIds = petsToSave.map(pet => pet._id as Types.ObjectId);
            user.pets = [...user.pets, ...petIds];
            await user.save();
            return user;
        } catch (error: any) {
            console.error('Erro ao cadastrar um novo pet:', error);
            throw new Error(`Erro ao adicionar o Pet: ${error.message}`);
        };      
    };
};