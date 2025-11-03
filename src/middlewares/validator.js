//중고 마켓
const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;
  if (!name) {
    return next(new Error('상품 이름(name)은 필수입니다'));
  }

  if (!description) {
    return next(new Error('상품 설명(description)은 필수입니다.'));
  }

  if (!price) {
    return next(new Error('상품 가격(price)은 필수입니다.'));
  }

  next();
};

//자유 게시판
const validateArticle = (req, res, next) => {
  const { title, content } = req.body;

  if (!title) {
    return next(new Error('게시글 제목(title)은 필수입니다.'));
  }

  if (!content) {
    return next(new Error('게시글 내용(content)은 필수입니다.'));
  }

  next();
};

//댓글
const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new Error('댓글 내용(content)은 필수입니다.'));
  }
  next();
};

export { validateProduct, validateArticle, validateComment };
