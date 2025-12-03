import { expressjwt } from 'express-jwt';
import productRepository from '../repositories/productRepository.js';
import articleRepository from '../repositories/articleRepository.js';
import { CustomError } from '../libs/Handler/errorHandler.js';
import jwt from 'jsonwebtoken';

const verifyAccessToken = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'user'
});

const softVerifyAccessToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
            next();
        });
    } else {
        next();
    }
};

const verifyRefreshToken = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});
async function verifyProduectAuth(req, res, next) {
    const id = req.params.id;

    const product = await productRepository.findById(id);
    if (!product) {
        throw new CustomError(404, 'product not found');
    }
    if (product.authorId !== req.user.id) {
        throw new CustomError(403, 'Forbidden');
    }
    return next();
};

async function verifyArticleAuth(req, res, next) {
    const id = req.params.id;

    const article = await articleRepository.findById(id);
    if (!article) {
        throw new CustomError(404, 'article not found');
    }
    if (article.authorId !== req.user.id) {
        throw new CustomError(403, 'Forbidden');
    }
    return next();
}

export default {
    verifyAccessToken,
    softVerifyAccessToken,
    verifyProduectAuth,
    verifyArticleAuth,
    verifyRefreshToken,
};