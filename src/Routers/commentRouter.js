import { EXPRESS } from './../libs/constants.js';
import catchAsync from './../libs/catchAsync.js';
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
    .post(catchAsync(PostComment));

commentRouter.route('/:id')
    .get(catchAsync(GetCommentById))
    .patch(catchAsync(PatchCommentById))
    .delete(catchAsync(DeleteCommentById));


export default commentRouter;