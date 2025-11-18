// routes/marketRouter.js
const express = require("express");
const { Product, Comment } = require("../models");
const { NotFoundError, BadRequestError } = require("../middleware/CustomError");
const {
  validateProduct,
  validateComment,
  uploadImage,
} = require("../middleware/validator");

const router = express.Router();

// 상품 목록 조회 및 등록
router
  .route("/")
  // 상품 목록 조회 API (offset 페이지네이션, 검색, 정렬)
  .get(async (req, res, next) => {
    try {
      const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const limitInt = parseInt(limit);

      const order = [["createdAt", sort === "recent" ? "DESC" : "ASC"]];

      let where = {};
      if (search) {
        where = {
          [Product.Sequelize.Op.or]: [
            { name: { [Product.Sequelize.Op.iLike]: `%${search}%` } },
            { description: { [Product.Sequelize.Op.iLike]: `%${search}%` } },
          ],
        };
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        attributes: ["id", "name", "price", "createdAt"],
        limit: limitInt,
        offset: offset,
        order: order,
      });

      res.status(200).json({
        success: true,
        totalItems: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limitInt),
        data: products,
      });
    } catch (error) {
      next(error);
    }
  })
  // 상품 등록 API (이미지 업로드 포함)
  .post(uploadImage, validateProduct, async (req, res, next) => {
    try {
      const { name, description, price, tags } = req.body;

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

      const product = await Product.create({
        name,
        description,
        price,
        tags: tagArray,
        imagePath,
      });

      res.status(201).json({
        success: true,
        message: "상품이 성공적으로 등록되었습니다.",
        data: {
          id: product.id,
          name: product.name,
          imagePath: product.imagePath,
        },
      });
    } catch (error) {
      next(error);
    }
  });

// 상품 상세 조회, 수정, 삭제
router
  .route("/:id")
  // 상품 상세 조회 API
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        attributes: [
          "id",
          "name",
          "description",
          "price",
          "tags",
          "imagePath",
          "createdAt",
        ],
      });

      if (!product) {
        throw new NotFoundError("요청한 상품을 찾을 수 없습니다.");
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  })
  // 상품 수정 API (PATCH)
  .patch(uploadImage, validateProduct, async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const product = await Product.findByPk(id);

      if (!product) {
        throw new NotFoundError("수정할 상품을 찾을 수 없습니다.");
      }

      if (updateData.tags) {
        updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
      }

      // 파일이 새로 업로드되면 imagePath 업데이트
      if (req.file) {
        updateData.imagePath = `/uploads/${req.file.filename}`;
      }

      // price를 숫자로 변환 (Joi에서 이미 처리되었을 수도 있으나 안전하게 처리)
      if (updateData.price) {
        updateData.price = parseInt(updateData.price);
      }

      const [updatedRows] = await Product.update(updateData, { where: { id } });

      if (updatedRows === 0) {
        throw new BadRequestError("상품 정보 수정에 실패했습니다.");
      }

      res
        .status(200)
        .json({
          success: true,
          message: "상품 정보가 성공적으로 수정되었습니다.",
        });
    } catch (error) {
      next(error);
    }
  })
  // 상품 삭제 API
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedRowCount = await Product.destroy({ where: { id } });

      if (deletedRowCount === 0) {
        throw new NotFoundError("삭제할 상품을 찾을 수 없습니다.");
      }

      // onDelete: 'CASCADE' 설정으로 연관된 댓글은 자동 삭제됨

      res
        .status(204)
        .json({ success: true, message: "상품이 성공적으로 삭제되었습니다." }); // 204 No Content
    } catch (error) {
      next(error);
    }
  });

// --- 댓글 API ---

// 상품 댓글 등록
router.post("/:productId/comments", validateComment, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoundError("댓글을 달 상품을 찾을 수 없습니다.");
    }

    const comment = await Comment.create({
      content,
      productId: parseInt(productId),
      articleId: null, // 상품 댓글이므로 articleId는 null
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

// 상품 댓글 목록 조회 API (Cursor 페이지네이션)
router.get("/:productId/comments", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const limitInt = parseInt(limit);

    // 상품 존재 여부 확인
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }

    let where = { productId: parseInt(productId) };

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
