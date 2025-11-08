// src/services/productService.js

const { prisma } = require('../../prisma/client');

// 상품 등록
exports.createProduct = async ({ name, description, price, tags, imagePath }) => {
    return await prisma.product.create({
        data: {
            name,
            description,
            price: Number(price),
            tags,
            imagePath
        }
    });
};

// 상품 상세 조회
exports.getProduct = async (id) => {
    return await prisma.product.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            imagePath: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

// 상품 수정
exports.updateProduct = async (id, { name, description, price, tags, imagePath }) => {
    try {
        const data = {};
        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (price !== undefined) data.price = Number(price);
        if (tags !== undefined) data.tags = tags;
        if (imagePath !== undefined) data.imagePath = imagePath;

        const updated = await prisma.product.update({
            where: { id: Number(id) },
            data
        });
        return updated;
    } catch (err) {
        return null;
    }
};

// 상품 삭제
exports.deleteProduct = async (id) => {
    try {
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        return true;
    } catch (err) {
        return false;
    }
};

// 상품 목록 (offset, 최신순, 검색 지원)
exports.listProducts = async ({ offset = 0, limit = 10, order = 'desc', search = '' }) => {
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }
        : {};

    return await prisma.product.findMany({
        where,
        orderBy: { createdAt: order.toLowerCase() === 'asc' ? 'asc' : 'desc' },
        skip: Number(offset),
        take: Number(limit),
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true
        }
    });
};
