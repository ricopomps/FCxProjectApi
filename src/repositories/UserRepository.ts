import mongoose from 'mongoose';
import User, { UserInterface } from '../schemas/User';

class UserRepository {
  public async index (query, skip, limit) {
    const paginatedResultQuery = [
      { $match: query },
      { $unset: 'password' }
    ];
    if (skip) {
      paginatedResultQuery.push({ $skip: skip });
    }
    if (limit) {
      paginatedResultQuery.push({ $limit: limit });
    }
    const [{ paginatedResult, totalCount }] = await User.aggregate([
      {
        $facet: {
          paginatedResult: paginatedResultQuery,
          totalCount: [
            { $match: query },
            { $count: 'totalCount' }]
        }
      }]);
    return { paginatedResult, totalCount: totalCount[0]?.totalCount };
  }

  public async findByProperties (properties: { key:string, keyValue: string | Date | number }[]) {
    return await User.find({
      $or: properties.map(item => ({ [item.key]: item.keyValue }))
    });
  }

  public async findByPropertiesIncluding (properties: { key:string, keyValue: string | Date }[]) {
    const reducedProperties = properties.reduce(
      (obj, item) => ({ ...obj, [item.key]: item.keyValue }), {});
    return await User.find(reducedProperties);
  }

  public async findOneByPropertiesIncluding (properties: { key:string, keyValue: string | Date }[]) {
    const reducedProperties = properties.reduce(
      (obj, item) => ({ ...obj, [item.key]: item.keyValue }), {});
    return await User.findOne(reducedProperties);
  }

  public async findById (id:mongoose.Types.ObjectId): Promise<Response> {
    return await User.findById(id);
  }

  public async login (login): Promise<Response> {
    return await User.findOne({ login }).select('+password').lean();
  }

  public async create (user:UserInterface) {
    return await User.create(user);
  }

  public async update (user:UserInterface) {
    return await User.findByIdAndUpdate(user._id, user, { new: true });
  }

  public async delete () {
    return await User.update({
      status: 1
    },
    { $set: { status: 2 } });
  }
}
export default new UserRepository();
