import { Schema, model, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  login: string;
  password: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: Date;
  motherName: string;
  status: number;
}

const UserSchema = new Schema(
  {
    name: String,
    login: String,
    password: { type: String, select: false },
    email: String,
    phone: String,
    cpf: String,
    birthdate: Date,
    motherName: String,
    status: Number
  },
  { timestamps: true }
);

export default model<UserInterface>('User', UserSchema);
