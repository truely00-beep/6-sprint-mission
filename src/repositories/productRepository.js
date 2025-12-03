import { prismaClient } from '../libs/constants.js';

async function findByUserId(userId) {
    return prismaClient.product.findMany({
        where: {
            id: userId,
        },
    });
}

async function findById(id, userId) {
    const include = {
        productLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.product.findUniqueOrThrow({
        where: {
            id,
        },
        include,
    });
}

async function findAll(findOptions, userId) {
    const include = {
        productLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.product.findMany({
        ...findOptions,
        include,
    });
}

async function update(id, data) {
    return prismaClient.product.update({
        where: {
            id,
        },
        data: {
            ...data,
        },
    });
}

async function create(userFields) {
    return await prismaClient.product.create({
        data: {
            ...userFields,
        },
    });
}

async function ondelete(id) {
    return await prismaClient.product.delete({
        where: {
            id,
        },
    });
}

export default {
    findById,
    findAll,
    update,
    create,
    ondelete,
    findByUserId,
};
