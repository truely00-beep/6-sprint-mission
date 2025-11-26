import { coerce, nonempty, object, string, optional, min } from 'superstruct';

export const signupStruct = object({
  email: coerce(string(), nonempty(string()), (value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('이메일은 필수입니다.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('유효한 이메일 형식이 아닙니다.');
    }
    return value;
  }),
  nickname: nonempty(string()),
  password: min(nonempty(string()), 8),
});

export const loginStruct = object({
  email: nonempty(string()),
  password: nonempty(string()),
});

export const updateUserStruct = object({
  nickname: optional(nonempty(string())),
  image: optional(string()),
});

export const changePasswordStruct = object({
  currentPassword: nonempty(string()),
  newPassword: min(nonempty(string()), 8),
});
