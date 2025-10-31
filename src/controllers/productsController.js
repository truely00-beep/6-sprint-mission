import { CreateProductSchema, PatchProductSchema } from '../validations/productsSchema.js';
import { validate } from 'superstruct';
import { prisma } from '../utils/prisma.js';

export async function createProduct(req, res, next) {
  const { body } = req;

  const [error, value] = validate(body, CreateProductSchema);

  if (error) {
    const validationError = new Error(`요청 데이터 형식이 올바르지 않습니다: ${error.message}`);
    validationError.status = 400;
    throw validationError;
  }
  const newProduct = await prisma.product.create({
    data: {
      name: value.name,
      description: value.description,
      price: value.price,
      tags: value.tags,
    },
  });

  res.status(201).json({
    message: '상품 등록이 성공적으로 등록되었습니다.',
    data: newProduct,
  });
}

export async function getProducts(req, res, next) {
  const { sort, search } = req.query;
  const { offset: _offset, limit: _limit } = req.paginationParams;

  const orderBy = {};

  if (sort === 'recent') {
    orderBy.createdAt = 'desc';
  }

  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { decription: { contains: search } }];
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
      where,
      orderBy,
      skip: _offset,
      take: _limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  if (search && totalProducts === 0) {
    return res.status(200).json({
      message: `${search}와 일치하는 상품을 찾을 수 없습니다.`,
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: _limit,
      },
    });
  }

  const totalPages = Math.ceil(totalProducts / _limit);

  res.status(200).json({
    message: '상품 목록을 조회했습니다.',
    data: products,
    pagination: {
      totalItems: totalProducts,
      totalPages: totalPages,
      currentPage: Math.floor(_offset / _limit) + 1,
      itemsPerPage: _limit,
    },
  });
}

export async function getProduct(req, res, next) {
  const { id } = req.params;

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
  res.status(200).send(product);
}

export async function patchProduct(req, res, next) {
  const { id } = req.params;
  const { body } = req;

  const [error, value] = validate(body, PatchProductSchema);

  if (error) {
    const validationError = new Error(`수정 데이터 형식이 올바르지 않습니다: ${error.message}`);
    validationError.status = 400;
    throw validationError;
  }

  if (Object.keys(value).length === 0) {
    const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
    emptyBodyError.status = 400;
    throw emptyBodyError;
  }

  const product = await prisma.product.update({
    where: { id },
    data: value,
  });

  res.status(200).json({
    message: '상품이 성공적으로 수정되었습니다.',
    data: product,
  });
}

export async function deleteProduct(req, res, next) {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: { id },
  });
  res.status(200).send(product);
}
