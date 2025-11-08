// src/services/commentService.js

const { prisma } = require('../../prisma/client');

// 중고마켓 댓글 추가
exports.createMarketComment = async (productId, content) => {
    return await prisma.marketComment.create({
        data: { productId: Number(productId), content }
    });
};

// 자유게시판 댓글 추가
exports.createBoardComment = async (articleId, content) => {
    return await prisma.boardComment.create({
        data: { articleId: Number(articleId), content }
    });
};

// 댓글 수정 (product/board 공통)
exports.updateComment = async (commentId, content) => {
    // marketComment, boardComment 모두에서 id를 찾음 (여기서는 marketComment만, boardComment는 별도 처리 추천)
    // 고도화하려면 entityType 인자 추가해 분기 처리하는 구조 가능
    try {
        let updated = await prisma.marketComment.update({
            where: { id: Number(commentId) },
            data: { content }
        });
        return updated;
    } catch (err) {
        // 없으면 자유게시판에서 검색
        try {
            let updated = await prisma.boardComment.update({
                where: { id: Number(commentId) },
                data: { content }
            });
            return updated;
        } catch (e) {
            return null;
        }
    }
};

// 댓글 삭제 (product/board 공통)
exports.deleteComment = async (commentId) => {
    try {
        await prisma.marketComment.delete({
            where: { id: Number(commentId) }
        });
        return true;
    } catch (err) {
        // 없으면 자유게시판에서 삭제
        try {
            await prisma.boardComment.delete({
                where: { id: Number(commentId) }
            });
            return true;
        } catch (e) {
            return false;
        }
    }
};

// 중고마켓 댓글 목록 (cursor pagination)
exports.listMarketComments = async (productId, cursor = 0, limit = 10) => {
    return await prisma.marketComment.findMany({
        where: {
            productId: Number(productId),
            id: { gt: Number(cursor) }
        },
        orderBy: { id: 'asc' },
        take: Number(limit),
        select: { id: true, content: true, createdAt: true }
    });
};

// 자유게시판 댓글 목록 (cursor pagination)
exports.listBoardComments = async (articleId, cursor = 0, limit = 10) => {
    return await prisma.boardComment.findMany({
        where: {
            articleId: Number(articleId),
            id: { gt: Number(cursor) }
        },
        orderBy: { id: 'asc' },
        take: Number(limit),
        select: { id: true, content: true, createdAt: true }
    });
};
