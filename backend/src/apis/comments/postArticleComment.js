import prisma from '../../prismaclient.js';

export async function postArticleComment(articleId, content) {
  const result = await prisma.comment.create({
    data: {
      content: content,
      articleId: articleId,// 게시글과 연결
    },
  });
  return result;
}
