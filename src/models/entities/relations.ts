import mongoose, { Schema } from "mongoose";

export enum crossStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected"
}
export interface Likes {
  idPet: string;
}
export interface Matchs {
  idPetSuitor: string;
  idMyPet: string;
}
export interface CrossRequest {
  status: crossStatus;
  petId: string;
}
export interface Relations {
  likes?: Likes;  
  matchs?: Matchs;  
  crossRequest?: CrossRequest;
}

const likesSchema = new Schema({
  idPet: { type: String, required: true }
});
const matchsSchema = new Schema({
  idPetSuitor: { type: String, required: true },
  idMyPet: { type: String, required: true }
});
const crossRequestSchema = new Schema({
  status: { type: String, enum: Object.values(crossStatus), required: true },
  petId: { type: String, required: true }
});
const relationsPetSchema = new Schema({
  likes: likesSchema,  
  matchs: matchsSchema,  
  crossRequest: crossRequestSchema
}, { timestamps: true });

export const RelationsPet = mongoose.model<Relations>('RelationsPet', relationsPetSchema);  
