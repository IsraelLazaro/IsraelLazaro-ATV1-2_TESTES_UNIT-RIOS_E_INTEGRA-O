import { PetType } from "../entities/pets";
import User from "../entities/user";

export default class FindSimilarPetsCaseUse{
    async execute(userId: string, pet: PetType): Promise<PetType[]>{
        const user = await User.findById(userId);
       
        if(!user)
            throw('Owner not found;')
        if(!user.address)  
            throw('Owner not found;')     
        const pets = await User.aggregate([
            {
                $geoNear: {
                    near: user.address.location,
                    distanceField: 'distance'
                }
            },
            {
                $match: {_id: {$ne: user._id}}
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'pets',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {specie: pet.specie}
                        }
                    ],
                    as: 'petObjects'
                }
            },
            {
                $unwind: '$petObjects',
            },
            {
                $addFields: {
                    sameBreed: {$eq: ['$petObjects.breed', pet.breed]}
                }
            },
            {
                $sort: {sameBreed: -1, distance: 1}
            },
            {
                $project: {
                    userName: 1,
                    profilePicture: 1,
                    distance: 1,
                    pet: '$petObjects'
                }
            },
            {
                $project: {
                    'pet.owner': 0,
                    'pet.relations': 0,

                }
            }
        ]);
        return pets;
    };
};