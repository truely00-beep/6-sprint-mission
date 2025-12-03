import { EXPRESS } from './../libs/constants.js';
import { catchAsync } from './../libs/catchAsync.js';
import auth from './../middlewares/auth.js';
import ArticleController from '../controller/articleController.js';

const articleRouter = EXPRESS.Router();
const articleController = new ArticleController();

articleRouter.route('/')
    .get(auth.softVerifyAccessToken, catchAsync(articleController.getArticles))
    .post(auth.verifyAccessToken, catchAsync(articleController.postArticle));

articleRouter.route('/:id')
    .get(auth.softVerifyAccessToken, catchAsync(articleController.getArticleById))
    .patch(auth.verifyAccessToken, auth.verifyArticleAuth, catchAsync(articleController.patchArticleById))
    .delete(auth.verifyAccessToken, auth.verifyArticleAuth, catchAsync(articleController.deleteArticleById));

articleRouter.post('/:id/like', auth.verifyAccessToken, catchAsync(articleController.likeArticle));

export default articleRouter;