import { EXPRESS } from './../libs/constants.js';
import catchAsync from './../libs/catchAsync.js';
import {
    GetProduct,
    PostProduct,
    GetProductById,
    PatchProductById,
    DeleteProductById
} from '../controller/productaController.js';

const productRouter = EXPRESS.Router();



productRouter.route('/')
    .get(catchAsync(GetProduct))
    .post(catchAsync(PostProduct));

productRouter.route('/:id')
    .get(catchAsync(GetProductById))
    .patch(catchAsync(PatchProductById))
    .delete(catchAsync(DeleteProductById));

export default productRouter;