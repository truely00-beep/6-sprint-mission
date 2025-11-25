import bcrypt from 'bcrypt';

export const hashingPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).send({ message: '비밀번호를 입력해주세요' });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    next();
  } catch (e) {
    next(e);
  }
};
