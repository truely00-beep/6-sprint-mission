import { prismaClient } from '../libs/constants.js';

async function find(userId, productId) {
    return prismaClient.productLike.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
}

async function create(userId, productId) {
    return prismaClient.productLike.create({
        data: {
            userId,
            productId,
        },
    });
}

async function remove(id) {
    return prismaClient.productLike.delete({
        where: {
            id,
        },
    });
}

async function findLikedProductsByUserId(userId) {
    return prismaClient.productLike.findMany({
        where: {
            userId,
        },
        include: {
            product: true,
        },
    });
}

export default {
    find,
    create,
    remove,
    findLikedProductsByUserId,
};
