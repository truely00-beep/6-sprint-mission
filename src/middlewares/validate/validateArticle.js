import * as s from 'superstruct';

const validateArt = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 500),
});

const validateUpdateArt = s.partial(validateArt);

export const validateArticle = (req, res, next) => {
  try {
    s.assert(req.body, validateArt);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateArticle = (req, res, next) => {
  try {
    s.assert(req.body, validateUpdateArt);
    next();
  } catch (e) {
    next(e);
  }
};
