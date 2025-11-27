import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

export const CreateProductComment = s.object({
  content: s.size(s.string(), 1, 50),
});

export const CreateArticleComment = s.object({
  content: s.size(s.string(), 1, 50),
});

export const PatchComment = s.object({
  content: s.size(s.string(), 1, 50),
});
