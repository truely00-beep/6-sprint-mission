import prisma from '../../prismaclient.js';

export async function deleteProduct(id) {

  await prisma.product.delete({
    where: { id: id },
  });
  await console.log(`Deleted product: ${id}`);
}
