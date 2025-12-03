import { EXPRESS } from './../libs/constants.js';
import { catchAsync } from './../libs/catchAsync.js';
import multer from 'multer';
import {
    UploadSingleImage
} from '../controller/uploadController.js';

const uploadRouter = EXPRESS.Router();

const upload = multer({ dest: 'upload/' });

uploadRouter.post('/', upload.single('attachment'),
    catchAsync(UploadSingleImage));

uploadRouter.use('/', EXPRESS.static('upload'));

export default uploadRouter;
