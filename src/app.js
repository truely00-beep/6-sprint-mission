// 필요한 모듈들을 가져옵니다
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES6 모듈에서 __dirname을 사용하기 위한 설정입니다
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수를 로드합니다
dotenv.config();

// Prisma 클라이언트를 가져옵니다 (데이터베이스 연결을 초기화)
import { prisma } from './prisma.js';

// 에러 핸들러 미들웨어를 가져옵니다
import { errorHandler, notFoundHandler, asyncHandler } from './lib/errors/errorHandler.js';

// 미들웨어를 가져옵니다
import { imageUpload, handleUploadError } from './lib/upload.js';
import {
  validateProductCreate,
  validateProductUpdate,
  validateArticleCreate,
  validateArticleUpdate,
  validateCommentCreate,
  validateCommentUpdate,
} from './lib/validation.js';

// Express 애플리케이션을 생성합니다
const app = express();

// 서버 포트를 설정합니다 (환경 변수가 없으면 3000번 포트 사용)
const PORT = process.env.PORT || 3000;

// CORS(Cross-Origin Resource Sharing) 설정을 합니다
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com'] // 프로덕션 환경에서는 특정 도메인만 허용
        : ['http://localhost:3000', 'http://localhost:3001'], // 개발 환경에서는 로컬호스트 허용
    credentials: true, // 쿠키나 인증 정보를 포함한 요청을 허용
  }),
);

// JSON 형태의 요청 본문을 파싱하는 미들웨어입니다 (최대 10MB)
app.use(express.json({ limit: '10mb' }));

// URL 인코딩된 요청 본문을 파싱하는 미들웨어입니다 (최대 10MB)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일을 서빙하는 미들웨어입니다 (업로드된 이미지 파일들)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 각 기능별 API 라우트를 직접 설정합니다 (인라인 로직 사용)

// 상품 API
app.get(
  '/api/products',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, sort = 'recent', search = '' } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    // 정렬 설정
    let orderBy = {};
    if (sort === 'recent') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    // 검색 조건
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // 상품 목록과 전체 개수를 동시에 조회
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.send({
      data: products,
      pagination: {
        total: totalCount,
        offset: skip,
        limit: take,
        hasMore: skip + take < totalCount,
      },
    });
  }),
);

app.post(
  '/api/products',
  validateProductCreate,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  }),
);

app.get(
  '/api/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
    });
    res.send(product);
  }),
);

app.patch(
  '/api/products/:id',
  validateProductUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(product);
  }),
);

app.delete(
  '/api/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.send(product);
  }),
);

// 게시글 API
app.get(
  '/api/articles',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, sort = 'recent', search = '' } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    // 정렬 설정
    let orderBy = {};
    if (sort === 'recent') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'title_asc') {
      orderBy = { title: 'asc' };
    } else if (sort === 'title_desc') {
      orderBy = { title: 'desc' };
    }

    // 검색 조건
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // 게시글 목록과 전체 개수를 동시에 조회
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.send({
      data: articles,
      pagination: {
        total: totalCount,
        offset: skip,
        limit: take,
        hasMore: skip + take < totalCount,
      },
    });
  }),
);

app.post(
  '/api/articles',
  validateArticleCreate,
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  }),
);

app.get(
  '/api/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
    });
    res.send(article);
  }),
);

app.patch(
  '/api/articles/:id',
  validateArticleUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id },
      data: req.body,
    });
    res.send(article);
  }),
);

app.delete(
  '/api/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id },
    });
    res.send(article);
  }),
);

// 댓글 API
app.get(
  '/api/comments/products/:productId',
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const take = parseInt(limit);

    // 상품 존재 확인
    await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const where = { productId };
    const comments = await prisma.productComment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      take,
    });

    res.send({
      data: comments,
      pagination: {
        hasMore: comments.length === take,
        nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
      },
    });
  }),
);

app.post(
  '/api/comments/products/:productId',
  validateCommentCreate,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { content } = req.body;

    // 상품 존재 확인
    await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const comment = await prisma.productComment.create({
      data: {
        content,
        productId,
      },
    });
    res.status(201).send(comment);
  }),
);

app.get(
  '/api/comments/articles/:articleId',
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const take = parseInt(limit);

    // 게시글 존재 확인
    await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    const where = { articleId };
    const comments = await prisma.articleComment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      take,
    });

    res.send({
      data: comments,
      pagination: {
        hasMore: comments.length === take,
        nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
      },
    });
  }),
);

app.post(
  '/api/comments/articles/:articleId',
  validateCommentCreate,
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { content } = req.body;

    // 게시글 존재 확인
    await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId,
      },
    });
    res.status(201).send(comment);
  }),
);

app.patch(
  '/api/comments/:id',
  validateCommentUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    // 댓글이 상품 댓글인지 게시글 댓글인지 확인
    let comment;
    try {
      comment = await prisma.productComment.update({
        where: { id },
        data: { content },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // 상품 댓글이 아니면 게시글 댓글로 시도
        comment = await prisma.articleComment.update({
          where: { id },
          data: { content },
        });
      } else {
        throw error;
      }
    }
    res.send(comment);
  }),
);

app.delete(
  '/api/comments/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 댓글이 상품 댓글인지 게시글 댓글인지 확인
    let comment;
    try {
      comment = await prisma.productComment.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // 상품 댓글이 아니면 게시글 댓글로 시도
        comment = await prisma.articleComment.delete({
          where: { id },
        });
      } else {
        throw error;
      }
    }
    res.send(comment);
  }),
);

// 이미지 업로드 API
app.post(
  '/api/upload/upload',
  imageUpload,
  handleUploadError,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).send({
        message: '이미지 파일이 필요합니다.',
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

    res.send({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: imagePath,
      url: fullUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  }),
);

// favicon 요청 처리 (브라우저가 자동으로 요청함)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// 서버 상태를 확인하는 헬스 체크 엔드포인트입니다
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString(),
  });
});

// 루트 경로에 대한 응답입니다 (API 정보 제공)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '중고마켓 & 자유게시판 API 서버',
    version: '1.0.0',
    endpoints: {
      products: '/api/products', // 상품 API
      articles: '/api/articles', // 게시글 API
      comments: '/api/comments', // 댓글 API
      upload: '/api/upload', // 파일 업로드 API
      health: '/api/health', // 헬스 체크 API
    },
  });
});

// 404 에러를 처리하는 미들웨어입니다 (위의 라우트들에 매칭되지 않는 요청)
app.use(notFoundHandler);

// 모든 에러를 처리하는 미들웨어입니다 (가장 마지막에 위치해야 함)
app.use(errorHandler);

// 서버를 시작합니다
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API 문서: http://localhost:${PORT}/`);
});

// Express 앱을 내보냅니다 (테스트용)
export default app;
