import { articleService } from '../services/articleService.js';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/structs.js';
import articleRepository from '../repositories/articleRepository.js';

export default class ArticleController {
    async getArticles(req, res) {
        const { offset = 0, limit = 0, order = 'newset', title = "", content = "" } = req.query;
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
        // parse offset/limit and only include `take` when a positive integer is provided
        const parsedOffset = Number.isNaN(parseInt(offset)) ? 0 : parseInt(offset);
        const parsedLimit = parseInt(limit);

        const findOptions = {
            where: {
                title: {
                    contains: title,
                },
                content: {
                    contains: content,
                },
            },
            orderBy,
            skip: parsedOffset,
        };

        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            findOptions.take = parsedLimit;
        }

        const userId = req.user ? req.user.userId : null;
        const articles = await articleService.getArticles(findOptions, userId);
        res.send(articles);
    }

    async getArticleById(req, res) {
        const { id } = req.params;
        const userId = req.user ? req.user.userId : null;
        const article = await articleService.getArticleById(id, userId);
        res.send(article);
    }

    async postArticle(req, res) {
        assert(req.body, CreateArticle);
        const { ...userFields } = req.body;
        const article = await articleRepository.create(userFields);
        res.status(201).send(article);
    }

    async patchArticleById(req, res) {
        const { id } = req.params;
        assert(req.body, PatchArticle);
        const { ...userFields } = req.body;
        const article = await articleRepository.update(id, userFields);
        res.send(article);
    }

    async deleteArticleById(req, res) {
        const { id } = req.params;
        const article = await articleRepository.ondelete(id);
        res.send(article);
    }

    async likeArticle(req, res) {
        const userId = req.user.userId;
        const articleId = req.params.id;
        const result = await articleService.likeArticle(userId, articleId);
        return res.status(200).json(result);
    }
}

