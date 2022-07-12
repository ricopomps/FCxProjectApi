import { Schema, model, Document } from 'mongoose';

interface UserInterface extends Document {
  name: string;
}

const UserSchema = new Schema(
  {
    name: String
  },
  { timestamps: true }
);

export default model<UserInterface>('User', UserSchema);
