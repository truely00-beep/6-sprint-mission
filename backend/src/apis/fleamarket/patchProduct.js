import prisma from '../../prismaclient.js';
export async function patchProduct(input) {
  if (!input.name || !input.description || !input.tags || input.tags.length === 0) {
    console.log('Please write a name or description or tags');
  }
  await prisma.product.upsert({
    where: { name: input.name },
    create: {
      name: input.name,
      description: input.description,
      tags: input.tags,
      price: input.price,
    },
    update: { description: input.description, tags: input.tags, price: input.price },
  });
  await console.log('patch is finished');
}
