import { commentsService } from '../services/commentsService.js';

export async function createComment(req, res, next) {
  try {
    const { articleId, productId } = req.params;
    const { content } = req.body;

    if (!content) {
      const err = new Error('댓글 내용이 비어 있습니다.');
      err.status = 400;
      throw err;
    }

    let newComment;
    if (articleId) {
      newComment = await commentsService.createArticleComment(articleId, content);
    } else if (productId) {
      newComment = await commentsService.createProductComment(productId, content);
    } else {
      const err = new Error('게시글 또는 상품 ID가 필요합니다.');
      err.status = 400;
      throw err;
    }

    res.status(201).json({
      message: '댓글이 성공적으로 등록되었습니다.',
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getComments(req, res, next) {
  try {
    const { articleId, productId } = req.params;
    const { cursor, limit } = req.paginationParams;

    let result;
    if (articleId) {
      result = await commentsService.findCommentsByArticleId({
        articleId,
        cursor,
        limit,
      });
    } else if (productId) {
      result = await commentsService.findCommentsByProductId({
        productId,
        cursor,
        limit,
      });
    } else {
      const err = new Error('게시글 또는 상품 ID가 필요합니다.');
      err.status = 400;
      throw err;
    }

    res.status(200).json({
      message: '댓글 목록을 조회했습니다.',
      data: result.comments,
      pagination: {
        nextCursor: result.nextCursor,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function patchComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      const err = new Error('수정할 내용이 비어 있습니다.');
      err.status = 400;
      throw err;
    }

    const updatedComment = await commentsService.updateCommentInDb(id, content);

    res.status(200).json({
      message: '댓글이 성공적으로 수정되었습니다.',
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;

    const deletedComment = await commentsService.deleteCommentInDb(id);

    res.status(200).json({
      message: '댓글이 성공적으로 삭제되었습니다.',
      data: deletedComment,
    });
  } catch (error) {
    next(error);
  }
}
