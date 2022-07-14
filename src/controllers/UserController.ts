import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await UserService.index();
    return res.json(users);
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const user = req.body;
    const createdUser = await UserService.create(user);
    return res.json(createdUser);
  }
}

export default new UserController();
