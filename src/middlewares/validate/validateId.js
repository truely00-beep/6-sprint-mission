import * as s from 'superstruct';
import isUuid from 'is-uuid';

const validateId = s.object({
  id: s.define('UUID', (value) => isUuid.v4(value)),
});

export const validateIdParam = (req, res, next) => {
  try {
    s.assert(req.params, validateId);
    next();
  } catch (e) {
    next(e);
  }
};
