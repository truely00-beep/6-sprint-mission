import * as productRepo from '../repositories/productRepository.js'

// 1. 상품 생성
export async function createProductService({ user, productData, imageFile}) {
  const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;

  return productRepo.createProduct({
    ...productData,
    imageUrl,
    user: { connect: { id: user.id }}
  });
}

// Router에 설정한 multer객체인 upload를 거치고 나오면 req.file이 생김
// req.file = {
//   fieldname: "image",
//   originalname: "cat.png",
//   mimetype: "image/png",
//   filename: "cat-982383.png",
//   destination: "/root/uploads",
//   path: '/root/uploads/cat-982383.png',
//   size: 123456
// }


// 2. 상품 수정
export async function updateProductService({ productId, user, productData }) {
  // 상품이 DB에 존재하는지 확인
  const product = await productRepo.findProductById(productId);

  if(!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }

  // 상품 테이블의 userId와 로그인 한 유저의 id가 맞는지 확인
  if (product.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  const updated = await productRepo.updateProduct(productId, {
    ...productData,
    user: { connect: { id: user.id }}
  })

  return updated;
}


// 3. 상품 삭제
export async function deleteProductService({ productId, user}) {
  const product = await productRepo.findProductById(productId);

  if (!product) {
    const err = new Error('Product not found')
    err.status = 404;
    throw err;
  }

  if (product.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  await productRepo.deleteProduct(productId)
}


// 4. 상품 상제 조회
export async function getProductDetailService(productId) { //productId만 받아오니까 굳이 { }객체 구조 분해 할당 할 필요 없다.
  const product = await productRepo.findProductById(productId, {
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      likes: { 
        select: { userId: true }},
      comments: { 
        select: { 
          id: true, 
          userId: true, 
          content: true 
        }
      }
    }
  })

  if (!product) {
    const err = new Error('Product not found')
    err.status = 404;
    throw err;
  }
  return product;
}


// 5. 상품 전체 목록 조회
export async function getProductListService({ offset=0, limit=10, order='newest', keyword }) {
    let orderBy;
  switch(order) {
    case 'oldest':
      orderBy = { createdAt: 'asc'}
      break;
    case 'newest':
      orderBy = { createdAt: 'desc'}
      break;
    default:
      orderBy = { createdAt: 'desc'}
  }

  // where : title에 keyword 포함 OR content에 keyword 포함(대소문자 구분 없이)
  const where = keyword
  ? {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' }},
        { description: { contains: keyword, mode: 'insensitive' }}
      ]
  }
  : undefined;

  return productRepo.findProducts({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      comments: true,
      userId: true,
    }
  })
}

