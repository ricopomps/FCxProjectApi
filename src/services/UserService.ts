import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserInterface } from './../schemas/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
  public async index (limit, baseQuery) {
    let query = {};
    const {
      name, login, cpf, ageGroup, maxInsertionDate, minInsertionDate,
      maxBirthDate, minBirthDate, minUpdateDate, maxUpdateDate, status, page = '1'
    } = baseQuery;
    const skip = limit * (page - 1);

    if (name) {
      query = { ...query, name: { $regex: name, $options: 'i' } };
    }
    if (login) {
      query = { ...query, login: { $regex: login, $options: 'i' } };
    }
    if (cpf) {
      query = { ...query, cpf: { $regex: cpf, $options: 'i' } };
    }
    if (ageGroup) {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      let minDate;
      let maxDate;
      switch (parseInt(ageGroup)) {
        case 1:
          minDate = new Date(year - 26, month, day);
          maxDate = new Date(year - 18, month, day);
          query = { ...query, birthdate: { $lte: maxDate, $gte: minDate } };
          break;
        case 2:
          minDate = new Date(year - 31, month, day);
          maxDate = new Date(year - 25, month, day);
          query = { ...query, birthdate: { $lte: maxDate, $gte: minDate } };
          break;
        case 3:
          minDate = new Date(year - 36, month, day);
          maxDate = new Date(year - 30, month, day);
          query = { ...query, birthdate: { $lte: maxDate, $gte: minDate } };
          break;
        case 4:
          minDate = new Date(year - 40, month, day);
          query = { ...query, birthdate: { $lte: minDate } };
          break;
        default:
          break;
      }
    }
    if (maxBirthDate) {
      query = { ...query, birthdate: { $lte: new Date(maxBirthDate) } };
    }
    if (minBirthDate) {
      query = { ...query, birthdate: { $gte: new Date(minBirthDate) } };
    }
    if (maxUpdateDate) {
      query = {
        ...query,
        updatedAt: { $lte: new Date(maxUpdateDate) }
      };
    }
    if (minUpdateDate) {
      query = {
        ...query,
        updatedAt: { $gte: new Date(minUpdateDate) }
      };
    }
    if (maxInsertionDate) {
      query = { ...query, createdAt: { $lte: new Date(maxInsertionDate) } };
    }
    if (minInsertionDate) {
      query = { ...query, createdAt: { $gte: new Date(minInsertionDate) } };
    }
    if (status) {
      query = { ...query, status: parseInt(status) };
    }
    return await UserRepository.index(skip, limit, query);
  }

  public async login (user: {login:string, password:string}) {
    const loggedUser = await UserRepository.login(user.login);
    if (user == null || !(await bcrypt.compare(user.password, loggedUser.password))) throw new Error('Usuário inválido');
    try {
      const accessToken = jwt.sign({ loggedUser }, process.env.ACCESS_TOKEN_SECRET);

      return ({ accessToken, loggedUser });
    } catch (error) {
      return null;
    }
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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const hashedUser = { ...user, password: hashedPassword };
    return await UserRepository.create(hashedUser);
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
