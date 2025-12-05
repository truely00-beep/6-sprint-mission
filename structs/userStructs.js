import * as s from 'superstruct';
import isEmail from 'is-email';

export const CreateUser = s.object({
  email: s.define('email', isEmail),
  nickname: s.size(s.string(), 1, 30),
  password: s.size(s.string(), 8, 20),
});
