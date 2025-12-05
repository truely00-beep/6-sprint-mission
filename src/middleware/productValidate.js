import { assert } from 'superstruct';
export function productValidate(struct) {
  return (req, res, next) => {
    try {
      const body = req.body;
      if (body.price) {
        body.price = parseInt(body.price, 10);
      }
      if (body.stock) {
        body.stock = parseInt(body.stock, 10);
      }

      assert(req.body, struct);
      next();
    } catch (e) {
      next(e);
    }
  };
}
