import prisma from '../../prismaclient.js';

export async function deleteProduct(id) {
  //id로만 삭제 가능하도록 설정()
  await prisma.product.delete({
    where: { id: id },
  });
  await console.log(`Deleted product: ${id}`);
}
