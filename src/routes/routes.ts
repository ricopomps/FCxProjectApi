import { Router } from 'express';
import UserController from './../controllers/UserController';

const routes = Router();

routes.get('/', UserController.index);
routes.post('/', UserController.create);
routes.put('/', UserController.update);
routes.delete('/', UserController.delete);

export default routes;
