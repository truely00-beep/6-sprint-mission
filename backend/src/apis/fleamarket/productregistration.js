import prisma from '../../prismaclient.js';

export async function productregistration(obj) {
  const [name, description, price, tags] = obj;
  try {
    await prisma.product.upsert({
      where: { name: name },
      create: {
        name: name,
        description: description,
        price: price,
        tags: [],
      },
      update: {},
    });
  } catch (err) {
    console.log(err);
  }
}
