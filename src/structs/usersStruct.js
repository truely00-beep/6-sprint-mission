import { coerce, nonempty, object, string, optional } from 'superstruct';

// 문자열 최소 길이 검증 (8자 이상)
const minLengthPassword = (value) => {
  if (typeof value !== 'string') {
    throw new Error('비밀번호는 문자열이어야 합니다.');
  }
  if (value.length < 8) {
    throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  return value;
};

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
  password: coerce(string(), string(), (value) => {
    if (!value || typeof value !== 'string' || value.length === 0) {
      throw new Error('비밀번호는 필수입니다.');
    }
    return minLengthPassword(value);
  }),
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
  newPassword: coerce(string(), string(), (value) => {
    if (!value || typeof value !== 'string' || value.length === 0) {
      throw new Error('새 비밀번호는 필수입니다.');
    }
    return minLengthPassword(value);
  }),
});
