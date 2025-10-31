import * as s from 'superstruct';

const validatePro = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 500),
  price: s.number(),
  tags: s.array(s.string()),
});

const validateUpdatePro = s.partial(validatePro);

export const validateProduct = (req, res, next) => {
  try {
    s.assert(req.body, validatePro);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateProduct = (req, res, next) => {
  try {
    s.assert(req.body, validateUpdatePro);
    next();
  } catch (e) {
    next(e);
  }
};
