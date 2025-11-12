export const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      message: '이름,설명, 혹은 가격이 없습니다.',
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: '가격이 0보다 작습니다.' });
  }

  next();
};

export const validateArticle = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: '내용이 없습니다.',
    });
  }

  next();
};
