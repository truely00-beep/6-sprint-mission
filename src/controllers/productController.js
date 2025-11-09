import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStruct.js';

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  const { offset = 0, limit = 10, search = '', order = 'recent' } = req.query;
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    },
    orderBy: { createdAt: order === 'recent' ? 'desc' : 'asc' },
    skip: parseInt(offset),
    take: parseInt(limit),
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  res.json(product);
};

export const createProduct = async (req, res) => {
  assert(req.body, CreateProduct);
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  assert(req.body, PatchProduct);
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
