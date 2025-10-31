import * as s from 'superstruct';

const validateCom = s.object({
  content: s.size(s.string(), 1, 500),
});

const validateUpdateCom = s.partial(validateCom);

export const validateComment = (req, res, next) => {
  try {
    s.assert(req.body, validateCom);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateComment = (req, res, next) => {
  try {
    s.assert(req.body, validateUpdateCom);
    next();
  } catch (e) {
    next(e);
  }
};
