import { Router } from 'express';
import UserController from './../controllers/UserController';

const routes = Router();

routes.get('/', UserController.index);
routes.post('/', UserController.create);
routes.put('/', UserController.update);
routes.delete('/', UserController.delete);
routes.post('/login', UserController.login);
routes.post('/recover', UserController.recoverPassword);
routes.get('/excel', UserController.exportExcel);
routes.get('/:id', UserController.findById);

export default routes;
