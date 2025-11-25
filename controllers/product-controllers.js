import { prisma } from '../lib/prismaclient.js';

export async function productNew(req, res) {
  const productCreate = await prisma.product.create({
    data: req.body,
    include: {
      comments: true,
    },
  });

  res.status(201).json(productCreate);
}

export async function productsList(req, res) {
  const {
    offset = 0,
    limit = 10,
    order = 'newest',
    name = '',
    description = '',
  } = req.query;

  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'asc' };
  }

  const product_list = await prisma.product.findMany({
    where: {
      name: { contains: name },
      description: { contains: description },
    },
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });

  if (!product_list)
    return res.status(401).json({ message: 'Cannot found List' });

  res.status(200).json(product_list);
}

export async function productOnly(req, res) {
  const id = req.params.id;
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });

  if (!product) return res.status(401).json({ message: `Cannot found ${id}` });

  res.status(200).json(product);
}

export async function productUpdate(req, res) {
  const id = req.params.id;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  const productUpdate = await prisma.product.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json(productUpdate);
}

export async function productDelete(req, res) {
  const id = req.params.id;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  await prisma.product.delete({
    where: { id },
  });

  res.status(204).json({ message: `Product Delete ${id}` });
}
