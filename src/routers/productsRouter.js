import express from 'express';
import { prisma } from '../utils/prisma.js';
import { validatePagination } from '../middlewares/paginationValidator.js';

const router = express.Router();

router
  .route('/')
  // 상품 등록 API
  .post(async (req, res) => {
    const data = req.body;
    const product = await prisma.product.create({
      data,
    });
    res.status(201).send(product);
  })
  // 상품 목록 조회 API
  .get(validatePagination, async (req, res) => {
    const { sort, search } = req.query;
    const { offset: _offset, limit: _limit } = req.paginationParams;

    const orderBy = {};
    if (sort === 'recent') {
      // ?sort=recent 쿼리가 있을 경우, createdAt 내림차순 (최신순)
      orderBy.createdAt = 'desc';
    }

    // + 검색 옵션: Prisma `where`에 전달할 객체
    const where = {};
    if (search) {
      // ?search 쿼리가 있을 경우
      // name 또는 description에 'search' 값이 포함된 것을 찾음 => OR 연산자 활용
      where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    }

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
        where, // 검색 조건
        orderBy, // 정렬 조건
        skip: _offset, // 건너뛸 개수
        take: _limit, // 가져올 개수
      }),

      // 전체 상품 개수 조회 (페이지네이션 계산용)
      prisma.product.count({
        where, // 검색 조건을 동일하게 적용
      }),
    ]);

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalProducts / _limit);

    // 7. 클라이언트에 응답 전송
    res.status(200).json({
      message: '상품 목록을 조회했습니다.',
      data: products,
      pagination: {
        totalItems: totalProducts,
        totalPages: totalPages,
        currentPage: Math.floor(_offset / _limit) + 1, // 현재 페이지 계산
        itemsPerPage: _limit,
      },
    });
  });

// :id 사용하는 API
router
  .route('/:id')
  // 상품 상세 조회 API
  .get(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
    });
    res.status(200).send(product);
  })
  // 상품 수정 API
  .patch(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    res.status(200).send(product);
  })
  // 상품 삭제 API
  .delete(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.status(200).send(product);
  });

export default router;
