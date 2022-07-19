import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import xl from 'excel4node';
import { UserInterface } from './../schemas/User';
import UserRepository from '../repositories/UserRepository';

class UserService {
  private makeQuery (baseQuery) {
    let query = {};
    const {
      name, login, cpf, ageGroup, maxInsertionDate, minInsertionDate,
      maxBirthDate, minBirthDate, minUpdateDate, maxUpdateDate, status = '1'
    } = baseQuery;

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
    return query;
  }

  public async index (limit, baseQuery) {
    const query = this.makeQuery(baseQuery);
    const skip = limit * (baseQuery?.page - 1);

    return await UserRepository.index(query, skip, limit);
  }

  public async login (user: {login:string, password:string}) {
    const loggedUser = await UserRepository.login(user.login);
    if (user === null || loggedUser === null || !(await bcrypt.compare(user.password, loggedUser.password)) || loggedUser.status !== 1) throw new Error('Usuário inválido');
    const accessToken = jwt.sign({ loggedUser }, process.env.ACCESS_TOKEN_SECRET);

    return ({ accessToken, loggedUser });
  }

  public async recoverPassword (user: {login:string, cpf:string, email:string, motherName:string, password:string}) {
    const existingUser = await UserRepository.findOneByPropertiesIncluding([
      { key: 'email', keyValue: user.email },
      { key: 'login', keyValue: user.login },
      { key: 'motherName', keyValue: user.motherName },
      { key: 'cpf', keyValue: user.cpf }
    ]
    );
    if (existingUser.length < 1 || existingUser.status !== 1) throw new Error('Usuário inválido');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    existingUser.password = hashedPassword;
    const updatedUser = await UserRepository.update(existingUser);
    return (updatedUser);
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

  public async delete () {
    return await UserRepository.delete();
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

  private async createExcel (headers, keys, data) {
    let headerColumnIndex = 1;
    let rowIndex = 2;

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Usuários');
    headers.forEach(header => {
      ws.column(headerColumnIndex).setWidth(25);
      ws.cell(1, headerColumnIndex++).string(header);
    });
    data.forEach(user => {
      let columnIndex = 1;
      keys.forEach(key => {
        if (typeof user[key].getMonth === 'function') {
          ws.cell(rowIndex, columnIndex++).string(this.formatDate(user[key]));
        } else {
          ws.cell(rowIndex, columnIndex++).string(user[key].toString());
        }
      });
      rowIndex++;
    });
    let excelFile;
    wb.write('Usuários.xlsx');
    await wb.writeToBuffer().then(function (buffer) {
      excelFile = buffer;
    });
    return excelFile;
  }

  private padTo2Digits (num) {
    return num.toString().padStart(2, '0');
  }

  private formatDate (date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear()
    ].join('/');
  }

  public async exportExcel (baseQuery) {
    const query = this.makeQuery(baseQuery);
    const { paginatedResult: data } = await UserRepository.index(query);
    const headers = ['Nome', 'Cpf', 'E-mail', 'Telefone', 'Data de Nascimento', 'Nome da Mãe', 'Login', 'Status'];
    const keys = ['name', 'cpf', 'email', 'phone', 'birthdate', 'motherName', 'login', 'status'];
    return await this.createExcel(headers, keys, data);
  }
}
export default new UserService();
