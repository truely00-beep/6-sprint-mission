import prisma from '../../prismaclient.js';

export async function deleteArticle(id) {

  await prisma.article.delete({
    where: { id: id },
  });
  await console.log(`Deleted product: ${id}`);
}
