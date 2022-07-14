import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await UserService.index();
    return res.json(users);
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const users = await UserService.findById(id);
    return res.json(users);
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const user = req.body;
    const createdUser = await UserService.create(user);
    return res.json(createdUser);
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const user = req.body;
    const updatedUser = await UserService.update(user);
    return res.json(updatedUser);
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const user = req.body;
    const deletedUser = await UserService.delete(user);
    return res.json(deletedUser);
  }
}

export default new UserController();
