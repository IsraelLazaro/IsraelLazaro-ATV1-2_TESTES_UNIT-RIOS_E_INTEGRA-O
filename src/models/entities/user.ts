import mongoose, { Schema } from "mongoose";

export interface Address {
    city: string; 
    state: string; 
    location: {
      type: 'Point',
      coordinates: [number, number]
    };
};
export interface UserType{
    name?: string;
    userName: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    address: Address;
    profilePicture?: string;
    role: string;
    createdAt: Date;
    updatedAt?: Date;
    pets?: mongoose.Types.ObjectId[];
};

const userSchema = new Schema<UserType>({
  name: { type: String },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cpf: { type: String },
  phone: { type: String },
  address: {
    city: { type: String },
    state: { type: String },
    location: {
      type: {type: String, required: true, enum: ['Point']},
      coordinates: {type: [Number], required: true}
    },
  },
  profilePicture: {type: String},
  role: { type: String, required: true, default:"User" },
  createdAt: { type: Date, default: Date.now,required: true },
  updatedAt: { type: Date, default: Date.now,},
  pets: { type: [Schema.Types.ObjectId], ref: "Pets", default: [] },
  });

  userSchema.index({location: '2dsphere'});

  const User = mongoose.model<UserType>('Users', userSchema);
  export default User;