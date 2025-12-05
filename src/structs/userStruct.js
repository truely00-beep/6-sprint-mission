import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

export const CreateUser = s.object({
  email: s.define('Email', isEmail), //s.define(<> ,...) <> =검사에서 실패했을 때 에러메시지에 사용
  password: s.size(s.string(), 8, 20),
  nickname: s.size(s.string(), 2, 10),
  name: s.size(s.string(), 1, 10),
  receivedEmail: s.optional(s.boolean()),
});

export const PatchUser = s.partial(s.omit(CreateUser, ['password']));

export const LoginUser = s.object({
  email: s.define('Email', isEmail),
  password: s.size(s.string(), 8, 20),
});

export const PatchPassword = s.object({
  password: s.size(s.string(), 8, 20),
  newPassword: s.size(s.string(), 8, 20),
});
