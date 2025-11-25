import { PrismaClient } from '../libs/constants.js';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../libs/structs.js';



export async function GetComment(req, res, next) {
    try {
        const { productId, articleId } = req.query;
        const { take = '10', cursor } = req.query;
        const parsedTake = parseInt(take, 10);

        if (isNaN(parsedTake) || parsedTake <= 0) {
            return res.status(400).send({ error: 'Invalid "take" parameter.' });
        }

        const whereClause = {};

        if (productId) {
            whereClause.productId = productId; // 상품 ID로 필터링
        } else if (articleId) {
            whereClause.articleId = articleId; // 게시글 ID로 필터링
        }

        const findOptions = {
            take: parsedTake,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        };

        if (cursor) {
            findOptions.skip = 1;
            findOptions.cursor = {
                id: cursor,
            };
        }

        const comments = await PrismaClient.comment.findMany(findOptions); // 
        let nextCursor = null;
        if (comments.length === parsedTake) {
            nextCursor = comments[comments.length - 1].id;
        }
        res.status(200).json({
            comments,
            nextCursor,
        });
    }
    catch { next(); }

}


export async function GetCommentById(req, res, next) {
    try {
        const { id } = req.params;
        const Comment = await PrismaClient.comment.findUniqueOrThrow({
            where: {
                id
            },
        });
        res.send(Comment);
    }
    catch { next(); }
}


export async function PostComment(req, res, next) {
    try {
        assert(req.body, CreateComment);
        const { content, productId, articleId } = req.body;
        if ((productId && articleId) || (!productId && !articleId)) {
            return res.status(400).json({
                error: 'Comment must belong to EITHER a Product OR an Article.',
            });
        }
        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Content cannot be empty.' });
        }

        const comment = await PrismaClient.comment.create({
            data: {
                content: content,
                productId: productId,
                articleId: articleId,
            },
        });
        res.status(201).send(comment);
    }
    catch { next(); }
}

export async function PatchCommentById(req, res, next) {
    try {
        const { id } = req.params;
        assert(req.body, PatchComment);
        const { content } = req.body;

        if (content !== undefined && content.trim() === '') {
            return res.status(400).json({ error: 'Content cannot be empty.' });
        }

        const comment = await PrismaClient.comment.update({
            where: {
                id
            },
            data: {
                content: content,
            },
        });
        res.send(comment);
    }
    catch { next(); }
}

export async function DeleteCommentById(req, res, next) {
    try {
        const { id } = req.params;
        const Comment = await PrismaClient.comment.delete({
            where: {
                id
            },
        });
        res.send(Comment);
    }
    catch { next(); }
}


