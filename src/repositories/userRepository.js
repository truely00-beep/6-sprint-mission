import { prismaClient } from '../libs/constants.js';

async function findById(id) {
    return prismaClient.user.findUnique({
        where: {
            id,
        },
    });
}

async function findByEmail(email) {
    return await prismaClient.user.findUnique({
        where: {
            email,
        },
    });
}

async function save(user) {
    return prismaClient.user.create({
        data: {
            email: user.email,
            nickname: user.nickname,
            password: user.password,
        },
    });
}

async function update(id, data) {
    return prismaClient.user.update({
        where: {
            id,
        },
        data: data,
    });
}

async function createOrUpdate(provider, providerId, email, name) {
    return prismaClient.user.upsert({
        where: { provider, providerId },
        update: { email, name },
        create: { provider, providerId, email, name },
    });
}

export default {
    findById,
    findByEmail,
    save,
    update,
    createOrUpdate,
};
