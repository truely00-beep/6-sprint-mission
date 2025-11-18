// routes/commentRouter.js
const express = require("express");
const { Comment } = require("../models");
const { NotFoundError, BadRequestError } = require("../middleware/CustomError");
const { validateComment } = require("../middleware/validator");

const router = express.Router();

// 댓글 수정, 삭제 (라우트 중복 제거 app.route()의 Router 버전)
router
  .route("/:commentId")
  // 댓글 수정 API (PATCH)
  .patch(validateComment, async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw new NotFoundError("수정할 댓글을 찾을 수 없습니다.");
      }

      const [updatedRows] = await Comment.update(
        { content },
        { where: { id: commentId } }
      );

      if (updatedRows === 0) {
        throw new BadRequestError("댓글 수정에 실패했습니다.");
      }

      res
        .status(200)
        .json({ success: true, message: "댓글이 성공적으로 수정되었습니다." });
    } catch (error) {
      next(error);
    }
  })
  // 댓글 삭제 API
  .delete(async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deletedRowCount = await Comment.destroy({
        where: { id: commentId },
      });

      if (deletedRowCount === 0) {
        throw new NotFoundError("삭제할 댓글을 찾을 수 없습니다.");
      }

      res
        .status(204)
        .json({ success: true, message: "댓글이 성공적으로 삭제되었습니다." }); // 204 No Content
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
