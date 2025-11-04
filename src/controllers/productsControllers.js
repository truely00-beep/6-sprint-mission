import { prisma } from '../prisma.js';

const productController = {
  // 상품 생성
  createProduct: async (req, res) => {
    try {
      const product = await prisma.product.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        message: '상품이 성공적으로 등록되었습니다.',
        data: product,
      });
    } catch (error) {
      console.error('상품 등록 오류:', error);
      res.status(500).json({
        success: false,
        message: '상품 등록 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 특정 상품 조회
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: '상품을 찾을 수 없습니다.',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error('상품 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '상품 조회 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 상품 수정
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      res.json({
        success: true,
        message: '상품이 성공적으로 수정되었습니다.',
        data: product,
      });
    } catch (error) {
      console.error('상품 수정 오류:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '상품을 찾을 수 없습니다.',
        });
      }

      res.status(500).json({
        success: false,
        message: '상품 수정 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 상품 삭제
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: '상품이 성공적으로 삭제되었습니다.',
        data: product,
      });
    } catch (error) {
      console.error('상품 삭제 오류:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '상품을 찾을 수 없습니다.',
        });
      }

      res.status(500).json({
        success: false,
        message: '상품 삭제 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 상품 목록 조회 (페이지네이션, 정렬, 검색)
  getProducts: async (req, res) => {
    try {
      const { offset = 0, limit = 10, sort = 'recent', search = '' } = req.query;

      const skip = parseInt(offset);
      const take = parseInt(limit);

      // 정렬 설정
      let orderBy = {};
      if (sort === 'recent') {
        orderBy = { created_at: 'desc' };
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
            created_at: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          total: totalCount,
          offset: skip,
          limit: take,
          hasMore: skip + take < totalCount,
        },
      });
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '상품 목록 조회 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },
};

export default productController;
