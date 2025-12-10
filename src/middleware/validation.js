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

export const validateRegister = (req, res, next) => {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    return res.status(400).json({
      message: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.',
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: '이메일과 비밀번호를 모두 입력해주세요.',
    });
  }

  next();
};

export const validatePatchProfile = (req, res, next) => {
  const { email, nickname, image } = req.body;

  if (!email && !nickname && typeof image === 'undefined') {
    return res.status(400).json({
      message: '변경할 값을 하나 이상 입력해주세요.',
    });
  }

  next();
};

export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: '현재 비밀번호와 새 비밀번호가 같습니다.',
    });
  }

  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '댓글 내용이 비어있습니다.' });
  }

  next();
};
