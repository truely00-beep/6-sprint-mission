import ForbiddenError from '../lib/errors/ForbiddenError.js';

export function authorizeSelf(req, res, next) {
  try {
    const loginUser = req.user;
    const { nickname } = req.params;

    if (loginUser.nickname !== nickname) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    return next();
  } catch (err) {
    return next(err);
  }
}
