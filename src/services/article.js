// src/services/articleService.js

const { prisma } = require('../../prisma/client'); // prisma client import

// 게시글 등록
exports.createArticle = async (title, content) => {
    return await prisma.article.create({
        data: { title, content }
    });
};

// 게시글 상세 조회
exports.getArticle = async (id) => {
    return await prisma.article.findUnique({
        where: { id: Number(id) },
        select: { id: true, title: true, content: true, createdAt: true }
    });
};

// 게시글 수정
exports.updateArticle = async (id, title, content) => {
    try {
        const updated = await prisma.article.update({
            where: { id: Number(id) },
            data: { title, content }
        });
        return updated;
    } catch (err) {
        // 게시글이 없으면 return null
        return null;
    }
};

// 게시글 삭제
exports.deleteArticle = async (id) => {
    try {
        await prisma.article.delete({
            where: { id: Number(id) }
        });
        return true;
    } catch (err) {
        return false;
    }
};

// 게시글 목록(검색, 페이징, 최신순)
exports.listArticles = async ({ offset = 0, limit = 10, order = 'desc', search = '' }) => {
    // Prisma의 OR 검색 & 페이징 구현
    const where = search
        ? {
              OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } }
              ]
          }
        : {};

    const articles = await prisma.article.findMany({
        where,
        orderBy: { createdAt: order.toLowerCase() === 'asc' ? 'asc' : 'desc' },
        skip: Number(offset),
        take: Number(limit),
        select: { id: true, title: true, content: true, createdAt: true }
    });

    return articles;
};
