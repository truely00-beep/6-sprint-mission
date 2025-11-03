import { articlesService } from '../services/articlesService.js';

export async function createArticle(req, res, next) {
  try {
    const { title, content } = req.body;
    const newArticle = await articlesService.createArticleInDb(title, content);

    res.status(201).json({
      message: '게시글이 성공적으로 등록되었습니다.',
      data: newArticle,
    });
  } catch (error) {
    next(error);
  }
}

export async function getArticles(req, res, next) {
  try {
    const { sort, search } = req.query;
    const { offset: _offset, limit: _limit } = req.paginationParams;

    const { articles, totalArticles } = await articlesService.findArticles({
      sort,
      search,
      offset: _offset,
      limit: _limit,
    });

    if (search && totalArticles === 0) {
      return res.status(200).json({
        message: `${search}와 일치하는 게시물을 찾을 수 없습니다.`,
        data: [],
        pagination: {},
      });
    }

    const totalPages = Math.ceil(totalArticles / _limit);
    const currentPage = Math.floor(_offset / _limit) + 1;

    res.status(200).json({
      message: '게시판 목록을 조회했습니다.',
      data: articles,
      pagination: {
        totalItems: totalArticles,
        totalPages,
        currentPage,
        itemsPerPage: _limit,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await articlesService.findArticleById(id);

    res.status(200).send(article);
  } catch (error) {
    next(error);
  }
}

export async function patchArticle(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
      emptyBodyError.status = 400;
      throw emptyBodyError;
    }

    const article = await articlesService.updateArticleInDb(id, updateData);

    res.status(200).json({
      message: '게시글이 성공적으로 수정되었습니다.',
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await articlesService.deleteArticleInDb(id);

    res.status(200).send(article);
  } catch (error) {
    next(error);
  }
}
