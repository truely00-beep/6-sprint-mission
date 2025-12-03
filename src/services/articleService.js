import articleLikeRepository from '../repositories/articleLikeRepository.js';
import articleRepository from '../repositories/articleRepository.js';

class ArticleService {
    async likeArticle(userId, articleId) {
        const existingLike = await articleLikeRepository.find(userId, articleId);

        if (existingLike) {
            await articleLikeRepository.remove(existingLike.id);
            return { liked: false };
        } else {
            await articleLikeRepository.create(userId, articleId);
            return { liked: true };
        }
    }

    async getArticleById(articleId, userId) {
        const article = await articleRepository.findById(articleId, userId);
        const { articleLikes, ...rest } = article;
        return { ...rest, isLiked: articleLikes.length > 0 };
    }

    async getArticles(findOptions, userId) {
        const articles = await articleRepository.findAll(findOptions, userId);
        return articles.map((article) => {
            const { articleLikes, ...rest } = article;
            return { ...rest, isLiked: articleLikes.length > 0 };
        });
    }
}

export const articleService = new ArticleService();
