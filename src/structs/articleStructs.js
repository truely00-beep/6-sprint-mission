import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 60),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);
