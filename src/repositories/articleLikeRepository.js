import { prismaClient } from '../libs/constants.js';

async function find(userId, articleId) {
    return prismaClient.articleLike.findUnique({
        where: {
            userId_articleId: {
                userId,
                articleId,
            },
        },
    });
}

async function create(userId, articleId) {
    return prismaClient.articleLike.create({
        data: {
            userId,
            articleId,
        },
    });
}

async function remove(id) {
    return prismaClient.articleLike.delete({
        where: {
            id,
        },
    });
}

export default {
    find,
    create,
    remove,
};
