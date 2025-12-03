export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export const catchAsyncAll = (...fns) => fns.map(catchAsync);