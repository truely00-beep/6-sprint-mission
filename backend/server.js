import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'; // 이미지 업로드
import path from 'path'; // 파일 경로
import prisma from './src/prismaclient.js'; // Prisma 클라이언트

// --- API 함수 임포트 ---
// Fleamarket
import { deleteProduct } from './src/apis/fleamarket/deleteProduct.js';
import { patchProduct } from './src/apis/fleamarket/patchProduct.js';
import { searchall } from './src/apis/fleamarket/searchall.js';
import { productregistration } from './src/apis/fleamarket/productregistration.js';

// Forum
import { deleteArticle } from './src/apis/forum/deleteArticle.js';
import { postArticle } from './src/apis/forum/postArticle.js'; // GURU: 이 파일 내용 수정 필요
import { searchAll as searchallArticles } from './src/apis/forum/searchAllArticles.js';
import { updateArticle } from './src/apis/forum/updateArticle.js';

// Comment (새로 추가)
import { postProductComment } from './src/apis/comment/postProductComment.js';
import { postArticleComment } from './src/apis/comment/postArticleComment.js';
import { patchComment } from './src/apis/comment/patchComment.js';
import { deleteComment } from './src/apis/comment/deleteComment.js';
import { getProductComments } from './src/apis/comment/getProductComments.js';
import { getArticleComments } from './src/apis/comment/getArticleComments.js';

// --- 환경 변수 및 앱 설정 ---
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // 'uploads' 폴더를 static으로 제공

// --- Multer (이미지 업로드) 설정 ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 저장 위치
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// --- 유효성 검사 미들웨어 ---
function productAuth(req, res, next) {
  const { name, price } = req.body;
  if (!name || typeof name !== 'string' || name.length < 1) {
    return res.status(400).json({ message: '상품 이름은 필수이며, 문자열이어야 합니다.' });
  }
  if (price === undefined || typeof price !== 'number') {
    // GURU: 0원일 수도 있으니 !price 대신 undefined 체크
    return res.status(400).json({ message: '가격은 필수이며, 숫자여야 합니다.' });
  }
  next(); // 통과
}

function articleAuth(req, res, next) {
  const { title, content } = req.body;
  if (!title || typeof title !== 'string' || title.length < 1) {
    return res.status(400).json({ message: '제목은 필수이며, 문자열이어야 합니다.' });
  }
  if (!content || typeof content !== 'string' || content.length < 1) {
    return res.status(400).json({ message: '내용은 필수이며, 문자열이어야 합니다.' });
  }
  next(); // 통과
}

function commentAuth(req, res, next) {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.length < 1) {
    return res.status(400).json({ message: '댓글 내용은 필수이며, 문자열이어야 합니다.' });
  }
  next(); // 통과
}

// --- API 라우트 ---
app.get('/', async (req, res) => {
  res.status(200).send('Home page');
});

// --- 중고마켓 (Product) API ---

// 1. 상품 등록 (POST /products)
app.post('/products', productAuth, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    // GURU: productregistration.js가 배열(obj)을 받아서
    await productregistration([name, description || '', price, tags || []]);
    res.status(201).json({ message: 'Product is successfully registered!' });
  } catch (err) {
    next(err);
  }
});

// 2. 상품 목록 조회 (GET /products) - 페이지네이션, 검색
app.get('/products', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip || '0', 10);
    const take = parseInt(req.query.take || '10', 10);
    const keyword = req.query.keyword || ''; // name, description 검색

    const products = await searchall(skip, take, keyword); // searchall 함수 사용
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// 3. 상품 상세 조회 (GET /products/:id)
app.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id },
      select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true },
    });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// 4. 상품 수정 (PATCH /products/:id)
app.patch('/products/:id', productAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    // GURU: patchProduct가 name 기준 upsert라 ID 기준으로 동작하게 수정함
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        price: price,
        tags: tags,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({ message: 'patch is finished', data: updatedProduct });
  } catch (err) {
    next(err);
  }
});

// 5. 상품 삭제 (DELETE /products/:id)
app.delete('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.status(200).json({ message: `Deleted product: ${id}` });
  } catch (err) {
    next(err);
  }
});

// --- 자유게시판 (Article) API ---

// 1. 게시글 등록 (POST /articles)
app.post('/articles', articleAuth, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    // GURU: postArticle.js가 comment를 생성하고 있어서 여기서 직접 Article 생성
    const newArticle = await prisma.article.create({
      data: { title: title, content: content },
    });
    res.status(201).json({ message: 'Article is successfully registered!', data: newArticle });
  } catch (err) {
    next(err);
  }
});

// 2. 게시글 목록 조회 (GET /articles) - 페이지네이션, 검색
app.get('/articles', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip || '0', 10);
    const take = parseInt(req.query.take || '10', 10);
    const keyword = req.query.keyword || '';

    const articles = await searchallArticles(skip, take, keyword);
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
});

// 3. 게시글 상세 조회 (GET /articles/:id)
app.get('/articles/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // GURU: getArticle.js가 return이 없어서 ID로 직접 조회
    const article = await prisma.article.findUnique({
      where: { id: id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
});

// 4. 게시글 수정 (PATCH /articles/:id)
app.patch('/articles/:id', articleAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // GURU: updateArticle.js가 name 기준 upsert라 ID 기준으로 동작하게 수정함
    const updatedArticle = await prisma.article.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({ message: 'Article patch is finished', data: updatedArticle });
  } catch (err) {
    next(err);
  }
});

// 5. 게시글 삭제 (DELETE /articles/:id)
app.delete('/articles/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteArticle(id);
    res.status(200).json({ message: `Deleted article: ${id}` });
  } catch (err) {
    next(err);
  }
});

// --- 댓글 (Comment) API ---

// 1. 상품 댓글 등록 (POST /products/:productId/comments)
app.post('/products/:productId/comments', commentAuth, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const result = await postProductComment(productId, content);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 2. 게시글 댓글 등록 (POST /articles/:articleId/comments)
app.post('/articles/:articleId/comments', commentAuth, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const result = await postArticleComment(articleId, content);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 3. 댓글 수정 (PATCH /comments/:commentId)
app.patch('/comments/:commentId', commentAuth, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const result = await patchComment(commentId, content);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 4. 댓글 삭제 (DELETE /comments/:commentId)
app.delete('/comments/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await deleteComment(commentId);
    res.status(200).json({ message: `Deleted comment: ${commentId}` });
  } catch (err) {
    next(err);
  }
});

// 5. 상품 댓글 목록 (GET /products/:productId/comments) - Cursor Pagination
app.get('/products/:productId/comments', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor } = req.query; // ?cursor=댓글ID
    const result = await getProductComments(productId, cursor);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 6. 게시글 댓글 목록 (GET /articles/:articleId/comments) - Cursor Pagination
app.get('/articles/:articleId/comments', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor } = req.query;
    const result = await getArticleComments(articleId, cursor);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// --- 이미지 업로드 API ---
app.post('/upload', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl: imageUrl });
  } catch (err) {
    next(err);
  }
});

// --- 404 및 전역 에러 핸들러 ---

// 404 핸들러 (일치하는 라우트 없음)
app.use((req, res, next) => {
  res.status(404).json({ message: '요청하신 경로를 찾을 수 없습니다.' });
});

// 전역 에러 핸들러 (모든 next(err)가 여기로 옴)
app.use((err, req, res, next) => {
  console.error(err); // 서버에 로그 남기기

  if (err.code === 'P2025') {
    // Prisma: Not Found
    return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
  }
  if (err.code === 'P2002') {
    // Prisma: Unique constraint failed
    return res.status(409).json({ message: '이미 존재하는 이름입니다.', fields: err.meta.target });
  }

  // 기본 500 서버 에러
  res.status(500).json({
    message: '서버 내부 오류가 발생했습니다.',
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
