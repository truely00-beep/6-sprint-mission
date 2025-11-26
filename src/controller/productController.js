import prisma from '../lib/prismaClient.js';

async function createProduct(req, res, next) {
  const data = await prisma.product.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(201).json(data);
}

async function getProducts(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const sort = req.query.sort || 'recent';
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

  const data = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: { id: true, name: true, price: true, createdAt: true },
  });

  const userId = req.auth?.userId; // 옵셔널체이닝이 없으면 오류가 나는 이유가 뭘까?
  if (userId) {
    const likeProductIds = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const filterLikeData = data
      .filter((d) => likeProductIds.likeProductId.includes(d.id))
      .map((d) => ({
        ...d,
        isLiked: true,
      }));
    const filterData = data
      .filter((d) => !likeProductIds.likeProductId.includes(d.id))
      .map((d) => ({
        ...d,
        isLiked: false,
      }));
    const userData = [...filterLikeData, ...filterData];
    const formattedData = userData.sort((a, b) =>
      sort === 'recent'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return res.status(200).json(formattedData);
  } else {
    return res.status(200).json(data);
  }
}

async function getProductById(req, res, next) {
  const { id } = req.params;
  const data = await prisma.product.findUniqueOrThrow({
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

  const userId = req.auth?.userId; // 옵셔널체이닝이 없으면 오류가 나는 이유가 뭘까?
  if (userId) {
    const likeProductIds = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    likeProductIds.likeProductId.includes(id)
      ? (data.isLiked = true)
      : (data.isLiked = false);
  }
  return res.status(200).json(data);
}

async function updateProduct(req, res, next) {
  const { id } = req.params;
  const data = await prisma.product.update({
    where: { id },
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(200).json(data);
}

async function deleteProduct(req, res, next) {
  const { id } = req.params;
  const data = await prisma.product.delete({
    where: { id },
  });
  res.status(204).json(data);
}

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
