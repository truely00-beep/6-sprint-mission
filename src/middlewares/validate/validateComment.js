import * as s from 'superstruct';

const createCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
});

const updateCommentSchema = s.partial(createCommentSchema);

export const validateCreateComment = (req, res, next) => {
  try {
    s.assert(req.body, createCommentSchema);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateComment = (req, res, next) => {
  try {
    s.assert(req.body, updateCommentSchema);
    next();
  } catch (e) {
    next(e);
  }
};
