import * as s from 'superstruct';

const createProductSchema = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 500),
  price: s.number(),
  tags: s.array(s.string()),
});

const updateProductSchema = s.partial(createProductSchema);

export const validateCreateProduct = (req, res, next) => {
  try {
    s.assert(req.body, createProductSchema);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateProduct = (req, res, next) => {
  try {
    s.assert(req.body, updateProductSchema);
    next();
  } catch (e) {
    next(e);
  }
};
