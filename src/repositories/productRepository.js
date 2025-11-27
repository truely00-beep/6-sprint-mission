import { prismaClient } from '../libs/constants.js';

async function findByAuthorId(authorId) {
    return prismaClient.product.findMany({
        where: {
            authorId,
        },
    });
}

async function findById(id) {
    return prismaClient.product.findUniqueOrThrow({
        where: {
            id,
        },
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
    update,
    create,
    ondelete,
    findByAuthorId,
};
