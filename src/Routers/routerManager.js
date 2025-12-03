import { EXPRESS } from './../libs/constants.js';
import productRouter from './productRouter.js';
import articleRouter from './articleRouter.js';
import commentRouter from './commentRouter.js';
import uploadRouter from './uploadRouter.js';
import userRouter from './userRouter.js';


export const RouterManager = EXPRESS.Router();



RouterManager.use('/products', productRouter);
RouterManager.use('/articles', articleRouter);
RouterManager.use('/comments', commentRouter);
RouterManager.use('/files', uploadRouter);
RouterManager.use('/user', userRouter);
