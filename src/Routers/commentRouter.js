import { EXPRESS } from './../libs/constants.js';
import { catchAsync, catchAsyncAll } from './../libs/catchAsync.js';
import auth from './../middlewares/auth.js';
import {
    GetComment,
    PostComment,
    GetCommentById,
    PatchCommentById,
    DeleteCommentById
} from '../controller/commentController.js';

const commentRouter = EXPRESS.Router();

commentRouter.route('/')
    .get(catchAsync(GetComment))
    .post(auth.verifyAccessToken, catchAsync(PostComment));

commentRouter.route('/:id')
    .get(catchAsync(GetCommentById))
    .patch(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, PatchCommentById))
    .delete(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, DeleteCommentById));


export default commentRouter;