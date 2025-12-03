import { EXPRESS } from './../libs/constants.js';
import { catchAsync } from './../libs/catchAsync.js';
import auth from './../middlewares/auth.js';
import ProductController from '../controller/productController.js';

const productRouter = EXPRESS.Router();
const productController = new ProductController();

productRouter.route('/')
    .get(auth.softVerifyAccessToken, catchAsync(productController.GetProduct))
    .post(auth.verifyAccessToken, catchAsync(productController.PostProduct));

productRouter.route('/:id')
    .get(auth.softVerifyAccessToken, catchAsync(productController.GetProductById))
    .patch(auth.verifyAccessToken, catchAsync(productController.PatchProductById))
    .delete(auth.verifyAccessToken, catchAsync(productController.DeleteProductById));

productRouter.post('/:id/like', auth.verifyAccessToken, catchAsync(productController.likeProduct));

export default productRouter;