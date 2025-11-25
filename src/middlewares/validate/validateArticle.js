import * as s from 'superstruct';

const createArticleSchema = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 500),
});

const updateArticleSchema = s.partial(createArticleSchema);

export const validateArticle = (req, res, next) => {
  try {
    s.assert(req.body, createArticleSchema);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateArticle = (req, res, next) => {
  try {
    s.assert(req.body, updateArticleSchema);
    next();
  } catch (e) {
    next(e);
  }
};
