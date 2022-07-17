import mongoose from 'mongoose';
import User, { UserInterface } from '../schemas/User';

class UserRepository {
  public async index (skip, limit, query) {
    const [{ paginatedResult, totalCount }] = await User.aggregate([
      {
        $facet: {
          paginatedResult: [
            { $match: query },
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $match: query },
            { $count: 'totalCount' }]
        }
      }]);
    return { paginatedResult, totalCount: totalCount[0]?.totalCount };
  }

  public async findByProperties (properties: { key:string, keyValue: string | Date }[]) {
    return await User.find({
      $or: properties.map(item => ({ [item.key]: item.keyValue }))
    });
  }

  public async findByPropertiesIncluding (properties: { key:string, keyValue: string | Date }[]) {
    const reducedProperties = properties.reduce(
      (obj, item) => ({ ...obj, [item.key]: item.keyValue }), {});
    return await User.find(reducedProperties);
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
