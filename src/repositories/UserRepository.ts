import mongoose from 'mongoose';
import User, { UserInterface } from '../schemas/User';

class UserRepository {
  public async index () {
    return await User.find();
  }

  public async findByProperties (properties: { key:string, keyValue: string | Date }[]) {
    User.find({
      $or: properties.map(item => ({ [item.key]: item.keyValue }))
    });
  }

  public async findById (id:mongoose.Types.ObjectId): Promise<Response> {
    return await User.findById(id);
  }

  public async create (user:UserInterface) {
    return await User.create(user);
  }

  public async update (user:UserInterface) {
    return await User.findByIdAndUpdate(user._id, user, { new: true });
  }

  public async delete (user:UserInterface) {
    return await User.deleteOne({ _id: mongoose.Types.ObjectId(user._id) });
  }
}
export default new UserRepository();
