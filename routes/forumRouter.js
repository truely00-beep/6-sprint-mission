// routes/forumRouter.js
const express = require("express");
const { Article, Comment } = require("../models");
const { NotFoundError, BadRequestError } = require("../middleware/CustomError");
const { validateArticle, validateComment } = require("../middleware/validator");

const router = express.Router();

// 게시글 목록 조회 및 등록
router
  .route("/")
  // 게시글 목록 조회 API (offset 페이지네이션, 검색, 정렬)
  .get(async (req, res, next) => {
    try {
      const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const limitInt = parseInt(limit);

      const order = [["createdAt", sort === "recent" ? "DESC" : "ASC"]];

      let where = {};
      if (search) {
        where = {
          [Article.Sequelize.Op.or]: [
            { title: { [Article.Sequelize.Op.iLike]: `%${search}%` } },
            { content: { [Article.Sequelize.Op.iLike]: `%${search}%` } },
          ],
        };
      }

      const { count, rows: articles } = await Article.findAndCountAll({
        where,
        attributes: ["id", "title", "content", "createdAt"],
        limit: limitInt,
        offset: offset,
        order: order,
      });

      res.status(200).json({
        success: true,
        totalItems: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limitInt),
        data: articles,
      });
    } catch (error) {
      next(error);
    }
  })
  // 게시글 등록 API
  .post(validateArticle, async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const article = await Article.create({ title, content });

      res.status(201).json({
        success: true,
        message: "게시글이 성공적으로 등록되었습니다.",
        data: { id: article.id, title: article.title },
      });
    } catch (error) {
      next(error);
    }
  });

// 게시글 상세 조회, 수정, 삭제
router
  .route("/:id")
  // 게시글 상세 조회 API
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id, {
        attributes: ["id", "title", "content", "createdAt"],
      });

      if (!article) {
        throw new NotFoundError("요청한 게시글을 찾을 수 없습니다.");
      }

      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  })
  // 게시글 수정 API (PATCH)
  .patch(validateArticle, async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const article = await Article.findByPk(id);

      if (!article) {
        throw new NotFoundError("수정할 게시글을 찾을 수 없습니다.");
      }

      const [updatedRows] = await Article.update(updateData, { where: { id } });

      if (updatedRows === 0) {
        throw new BadRequestError("게시글 수정에 실패했습니다.");
      }

      res
        .status(200)
        .json({
          success: true,
          message: "게시글이 성공적으로 수정되었습니다.",
        });
    } catch (error) {
      next(error);
    }
  })
  // 게시글 삭제 API
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedRowCount = await Article.destroy({ where: { id } });

      if (deletedRowCount === 0) {
        throw new NotFoundError("삭제할 게시글을 찾을 수 없습니다.");
      }

      // onDelete: 'CASCADE' 설정으로 연관된 댓글은 자동 삭제됨

      res
        .status(204)
        .json({
          success: true,
          message: "게시글이 성공적으로 삭제되었습니다.",
        }); // 204 No Content
    } catch (error) {
      next(error);
    }
  });

// --- 댓글 API ---

// 게시글 댓글 등록
router.post("/:articleId/comments", validateComment, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    const article = await Article.findByPk(articleId);
    if (!article) {
      throw new NotFoundError("댓글을 달 게시글을 찾을 수 없습니다.");
    }

    const comment = await Comment.create({
      content,
      articleId: parseInt(articleId),
      productId: null, // 게시글 댓글이므로 productId는 null
    });

    res.status(201).json({
      success: true,
      message: "댓글이 성공적으로 등록되었습니다.",
      data: { id: comment.id, content: comment.content },
    });
  } catch (error) {
    next(error);
  }
});

// 게시글 댓글 목록 조회 API (Cursor 페이지네이션)
router.get("/:articleId/comments", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const limitInt = parseInt(limit);

    // 게시글 존재 여부 확인
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    let where = { articleId: parseInt(articleId) };

    // 커서 방식: cursor 값(이전 댓글의 ID)보다 작은 ID를 조회 (최신순 가정)
    if (cursor) {
      where.id = { [Comment.Sequelize.Op.lt]: cursor };
    }

    const comments = await Comment.findAll({
      where,
      attributes: ["id", "content", "createdAt"],
      limit: limitInt,
      order: [["id", "DESC"]], // 최신 댓글부터 (ID가 큰 순서)
    });

    // 다음 페이지 커서 설정
    const nextCursor =
      comments.length === limitInt ? comments[comments.length - 1].id : null;

    res.status(200).json({
      success: true,
      data: comments,
      nextCursor: nextCursor,
      hasMore: comments.length === limitInt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
