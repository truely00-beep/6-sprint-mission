import { EXPRESS } from './../libs/constants.js';
import { catchAsync, catchAsyncAll } from './../libs/catchAsync.js';
import auth from './../middlewares/auth.js';
import {
    GetArticle,
    PostArticle,
    GetArticleById,
    PatchArticleById,
    DeleteArticleById
} from '../controller/articleController.js';

const articleRouter = EXPRESS.Router();



articleRouter.route('/')
    .get(catchAsync(GetArticle))
    .post(auth.verifyAccessToken, catchAsync(PostArticle));

articleRouter.route('/:id')
    .get(catchAsync(GetArticleById))
    .patch(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, PatchArticleById))
    .delete(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, DeleteArticleById));


export default articleRouter;