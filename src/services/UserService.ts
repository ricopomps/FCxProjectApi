import { UserInterface } from '../schemas/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
  public async index () {
    return await UserRepository.index();
  }

  public async findById (id): Promise<Response> {
    return await UserRepository.findById(id);
  }

  public async create (user:UserInterface) {
    return await UserRepository.create(user);
  }

  public async update (user:UserInterface) {
    return await UserRepository.update(user);
  }

  public async delete (user:UserInterface) {
    return await UserRepository.delete(user);
  }
}
export default new UserService();
