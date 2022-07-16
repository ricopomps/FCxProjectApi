import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserService.index();
      return res.json(users);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body;
      const loggedUser = await UserService.login(user);
      return res.json(loggedUser);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const users = await UserService.findById(id);
      return res.json(users);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  public async create (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body;
      const createdUser = await UserService.create(user);
      return res.json(createdUser);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body;
      const updatedUser = await UserService.update(user);
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body;
      const deletedUser = await UserService.delete(user);
      return res.json(deletedUser);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new UserController();
