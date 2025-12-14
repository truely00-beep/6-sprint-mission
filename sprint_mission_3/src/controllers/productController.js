import { assert } from 'superstruct'
import { CreateProduct, PatchProduct } from '../struct.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { 
  createProductService,
  updateProductService,
  deleteProductService,
  getProductDetailService,
  getProductListService
} from '../services/productService.js'


//1. 상품 수정, 삭제 할때는 입력한 id가 테이블에 존재하는지 확인
//2. 테이블의 userId가 로그인한 유저의 id와 일치하는지 확인(로그인 한 유저인지 확인)


// 상품 등록 POST (로그인 한 유저만 상품 등록)
// POST /products
export const postProduct = asyncHandler(async(req, res) => {
  // 1. 우선 리퀘스트로 받은 req.body에서 price를 number로 변환
  const raw = req.body;
  const productData = {
    ...raw,
    price: Number(raw.price)
  }
  // price type이 number로 변했나 봑인
  // console.log(typeof product_data.price)

  // price가 숫자가 아니면 (NaN -> true) 에러처리
  if (Number.isNaN(productData.price)) {
    return res.status(400).json({ message: 'price는 숫자여야 합니다.'})
  }

  // 2. 변환된 데이터로 검증
  assert(productData, CreateProduct)

  // 3. 서비스 호출
  const product = await createProductService({
    user: req.user,
    productData,
    imageFile: req.file
  });

  res.status(201).json(product);
})


// 상품 수정 PATCH (/:id) (로그인 한 유저만 상품 수정)
// PATCH /products/:productId
export const patchProduct = asyncHandler(async(req, res) => {
  const raw = req.body;
  const productData = { ...raw };

  // price가 들어온 경우에만 변환
  if (productData.price !== undefined) {
    productData.price = Number(productData.price)
    
    if (Number.isNaN(productData.price)) {
      return res.status(400).json({ message: 'price는 숫자여야 합니다.'})
    }
  }

  assert(productData, PatchProduct);

  const updated = await updateProductService({
    productId: req.params.productId,
    // console.log('productId 타입: ', typeof productId)
    user: req.user,
    productData: req.body
  });

// { // updateProductService 함수의 파라미터로 전달
//   productId: '3',
//   user: { id: 1, email: 'qkrrjstns23@gmail.com', ... },
//   productData: { name : '...', description: '...' }
// }  
  
  res.status(200).json(updated)
})


// 상품 삭제 DELETE (/:id) 로그인 한 유저만 상품 삭제
// DELETE /products/:productId 
export const deleteProduct = asyncHandler(async(req, res) => {
  await deleteProductService({
    productId: req.params.productId,
    user: req.user
  })
  res.status(204).send();
})


// GET http://localhost:3000/products/{productId}
// 로그인 한 유저가 특정 상품 상세 조회
export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductDetailService(req.params.productId)
  res.status(200).json(product)
})


// GET  http://localhost:3000/products?keyword=""&offset=""&limit=""&order=""
// 로그인 안 한 유저의 상품 목록 조회 (좋아요 개수는 못 봄)
export const getListProducts = asyncHandler(async(req, res) => {
  const { offset=0, limit=10, order='newest', keyword } = req.query;

  const list = await getProductListService({ offset, limit, order, keyword })
  res.status(200).json(list);
})