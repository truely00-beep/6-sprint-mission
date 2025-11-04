import { prisma } from '../prisma.js';

const articleController = {
  // 게시글 생성
  createArticle: async (req, res) => {
    try {
      const article = await prisma.article.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        message: '게시글이 성공적으로 등록되었습니다.',
        data: article,
      });
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      res.status(500).json({
        success: false,
        message: '게시글 등록 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 특정 게시글 조회
  getArticleById: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
      });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: '게시글을 찾을 수 없습니다.',
        });
      }

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      console.error('게시글 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '게시글 조회 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 게시글 수정
  updateArticle: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await prisma.article.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      res.json({
        success: true,
        message: '게시글이 성공적으로 수정되었습니다.',
        data: article,
      });
    } catch (error) {
      console.error('게시글 수정 오류:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '게시글을 찾을 수 없습니다.',
        });
      }

      res.status(500).json({
        success: false,
        message: '게시글 수정 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 게시글 삭제
  deleteArticle: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await prisma.article.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: '게시글이 성공적으로 삭제되었습니다.',
        data: article,
      });
    } catch (error) {
      console.error('게시글 삭제 오류:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '게시글을 찾을 수 없습니다.',
        });
      }

      res.status(500).json({
        success: false,
        message: '게시글 삭제 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },

  // 게시글 목록 조회 (페이지네이션, 정렬, 검색)
  getArticles: async (req, res) => {
    try {
      const { offset = 0, limit = 10, sort = 'recent', search = '' } = req.query;

      const skip = parseInt(offset);
      const take = parseInt(limit);

      // 정렬 설정
      let orderBy = {};
      if (sort === 'recent') {
        orderBy = { created_at: 'desc' };
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
            created_at: true,
          },
        }),
        prisma.article.count({ where }),
      ]);

      res.json({
        success: true,
        data: articles,
        pagination: {
          total: totalCount,
          offset: skip,
          limit: take,
          hasMore: skip + take < totalCount,
        },
      });
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '게시글 목록 조회 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },
};

export default articleController;
