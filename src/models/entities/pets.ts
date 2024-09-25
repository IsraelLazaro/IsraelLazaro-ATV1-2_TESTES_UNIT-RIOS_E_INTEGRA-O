import mongoose, { Schema, Document } from "mongoose";

export interface PetType extends Document {
    name: string;
    age: number;
    specie: string; 
    breed: string;
    weight?: number;
    size?: number;
    photos?: string[];
    relations?: mongoose.Types.ObjectId[];
};
const petSchema = new Schema<PetType>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    specie: { type: String, required: true },
    breed: { type: String, required: true },
    weight: { type: Number },
    size: { type: Number },
    photos: [{ type: String }],
    relations: [{ type: Schema.Types.ObjectId, ref: 'Relations' }]    
});

const PetsModel = mongoose.model<PetType>('Pets', petSchema);

export default PetsModel;