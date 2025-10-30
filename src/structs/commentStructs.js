import * as s from 'superstruct';
import isUuid from 'is-uuid';

export const CreateProductComment = s.object({
  productId: s.define('Uuid', (value) => isUuid.v4(value)),
  content: s.string(),
});

export const CreateArticleComment = s.object({
  articleId: s.define('Uuid', (value) => isUuid.v4(value)),
  content: s.string(),
});

export const PatchProductComment = s.partial(CreateProductComment);
export const PatchArticleComment = s.partial(CreateArticleComment);
