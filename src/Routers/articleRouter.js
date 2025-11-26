import { EXPRESS } from './../libs/constants.js';
import catchAsync from './../libs/catchAsync.js';
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
    .post(catchAsync(PostArticle));

articleRouter.route('/:id')
    .get(catchAsync(GetArticleById))
    .patch(catchAsync(PatchArticleById))
    .delete(catchAsync(DeleteArticleById));


export default articleRouter;