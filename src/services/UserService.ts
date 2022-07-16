import { UserInterface } from './../schemas/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
  public async index () {
    return await UserRepository.index();
  }

  public async login (user: {login:string, password:string}) {
    const loggedUser = await UserRepository.findByPropertiesIncluding([
      { key: 'login', keyValue: user.login },
      { key: 'password', keyValue: user.password }]);
    if (!loggedUser.length) throw new Error('Usuário inválido');
    return loggedUser;
  }

  public async findById (id): Promise<Response> {
    return await UserRepository.findById(id);
  }

  public async create (user:UserInterface) {
    this.validateUser(user);

    const existingUser = await UserRepository.findByProperties([
      { key: 'email', keyValue: user.email },
      { key: 'cpf', keyValue: user.cpf }
    ]
    );

    if (existingUser.length) throw new Error('Usuário já existe');

    return await UserRepository.create(user);
  }

  public async update (user:UserInterface) {
    return await UserRepository.update(user);
  }

  public async delete (user:UserInterface) {
    return await UserRepository.delete(user);
  }

  private validateUser (user:UserInterface): void {
    const keys: {key:string, text:string}[] = [
      { key: 'name', text: 'Nome' },
      { key: 'login', text: 'Login' },
      { key: 'email', text: 'E-mail' },
      { key: 'phone', text: 'Telefone' },
      { key: 'cpf', text: 'Cpf' },
      { key: 'motherName', text: 'Nome da mãe' },
      { key: 'birthdate', text: 'Data de nascimento' }
    ];
    const errors: string[] = [];
    keys.forEach(({ key, text }) => {
      if (!user[key]) {
        errors.push(text);
      }
    });
    if (errors.length > 0) {
      const message = errors.length === 1
        ? `A propriedade '${errors[0]}' é obrigatória`
        : `As propriedades '${errors.join(', ')}' são obrigatórias`;

      throw new Error(message);
    }
  }
}
export default new UserService();
