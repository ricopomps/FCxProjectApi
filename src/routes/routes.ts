import { Router } from 'express';
import UserController from './../controllers/UserController';

const routes = Router();

routes.get('/', UserController.index);
routes.get('/:id', UserController.findById);
routes.post('/', UserController.create);
routes.put('/', UserController.update);
routes.delete('/', UserController.delete);
routes.post('/login', UserController.login);

export default routes;
