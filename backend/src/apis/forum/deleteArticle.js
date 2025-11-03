import prisma from '../../prismaclient.js';

export async function deleteArticle(id) {
  //id로만 삭제 가능하도록 설정()
  await prisma.article.delete({
    where: { id: id },
  });
  await console.log(`Deleted product: ${id}`);
}
