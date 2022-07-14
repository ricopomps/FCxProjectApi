import User, { UserInterface } from '../schemas/User';

class UserRepository {
  public async index () {
    return await User.find();
  }

  public async create (user:UserInterface) {
    return await User.create(user);
  }
}
export default new UserRepository();
