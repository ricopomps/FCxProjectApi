import { UserInterface } from '../schemas/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
  public async index () {
    return await UserRepository.find();
  }

  public async create (user:UserInterface) {
    return await UserRepository.create(user);
  }
}
export default new UserService();
