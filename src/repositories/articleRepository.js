import { prismaClient } from '../libs/constants.js';

async function findById(id, userId) {
    const include = {
        articleLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.article.findUniqueOrThrow({
        where: {
            id,
        },
        include,
    });
}

async function findAll(findOptions, userId) {
    const include = {
        articleLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.article.findMany({
        ...findOptions,
        include,
    });
}

async function create(userFields) {
    return await prismaClient.article.create({
        data: {
            ...userFields,
        },
    });
}

async function update(id, data) {
    return prismaClient.article.update({
        where: {
            id,
        },
        data: {
            ...data,
        },
    });
}

async function ondelete(id) {
    return await prismaClient.article.delete({
        where: {
            id,
        },
    });
}

export default {
    findById,
    findAll,
    create,
    update,
    ondelete,
};
