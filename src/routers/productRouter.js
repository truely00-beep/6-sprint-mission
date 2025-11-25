import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateProduct, PatchProduct } from '../structs/productStruct.js';
import { uploadHandler } from '../middleware/upload.js';
import multer from 'multer';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { ProductController } from '../controller/productController.js';
// const app = express();
// app.use(express.json()); >> app.js에 이미 있음

const productRouter = express.Router();

//리스트 조회, 상품 등록
productRouter
  .route('/')
  .get(tryCatchHandler(ProductController.getProduct))
  .post(validate(CreateProduct), tryCatchHandler(ProductController.createProduct));
// .post('/files', upload.single('attachment'), uploadHandler()); >> route().post() 처럼 라우트 체인 안에 있을때는 따로 post api 만들기

//app.use('/files', express.static('uploads')); //>> app.js 미들웨어로 추가
//상품 상세 조회 , 상품 업데이트 , 상품 삭제
productRouter
  .route('/:productId')
  .get(tryCatchHandler(ProductController.getProductDetail))
  .patch(validate(PatchProduct), tryCatchHandler(ProductController.patchProduct))
  .delete(tryCatchHandler(ProductController.deleteProduct));

// 상품 이미지 업로드
const upload = multer({ dest: 'productupload/' });
productRouter.post('/files', upload.single('attachment'), uploadHandler());

export default productRouter;
