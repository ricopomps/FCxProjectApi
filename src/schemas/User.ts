import { Schema, model, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  login: string;
  password: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  motherName: string;
  status: string;
}

const UserSchema = new Schema(
  {
    name: String,
    login: String,
    password: String,
    email: String,
    phone: String,
    cpf: String,
    birthdate: String,
    motherName: String,
    status: String
  },
  { timestamps: true }
);

export default model<UserInterface>('User', UserSchema);
