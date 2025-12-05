export default function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error(err.code);

      next(err);
    }
  };
}
