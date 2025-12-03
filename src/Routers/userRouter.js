import { EXPRESS } from './../libs/constants.js';
import { catchAsync } from './../libs/catchAsync.js';
import UserServiceController from '../controller/userController.js';
import auth from '../middlewares/auth.js';

const userRouter = EXPRESS.Router();
const userController = new UserServiceController();


userRouter.post('/', catchAsync(userController.register));
userRouter.post('/login', catchAsync(userController.login));
userRouter.post('/token/refresh',
    auth.verifyRefreshToken, catchAsync(userController.refresh));

userRouter.get('/me', auth.verifyAccessToken, catchAsync(userController.GetMe));
userRouter.patch('/me', auth.verifyAccessToken, catchAsync(userController.updateMe));
userRouter.patch('/me/password', auth.verifyAccessToken, catchAsync(userController.updateMyPassword));
userRouter.get('/me/products', auth.verifyAccessToken, catchAsync(userController.getMyProducts));



export default userRouter;