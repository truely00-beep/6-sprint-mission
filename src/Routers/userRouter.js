import { EXPRESS } from './../libs/constants.js';
import catchAsync from './../libs/catchAsync.js';
import { login, register } from '../controller/userController.js';

const userRouter = EXPRESS.Router();

userRouter.post('/', catchAsync(register));
userRouter.post('/login', catchAsync(login));


export default userRouter;