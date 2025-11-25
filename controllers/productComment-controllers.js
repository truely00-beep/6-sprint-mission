import { prisma } from '../lib/prismaclient.js';

export async function productCommentNew(req, res) {
  const productId = req.params.productId;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(404).json({ message: 'Cannot found Product' });

  const { content } = req.body;
  const commentCreate = await prisma.commentProduct.create({
    data: {
      content,
      product: {
        connect: { id: productId },
      },
    },
    include: {
      product: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function productCommentList(req, res) {
  const productId = req.params.productId;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(404).json({ message: 'Cannot found Product' });

  const productComments = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!productComments)
    return res.status(404).json({ message: 'Cannot found Product comment' });

  res.status(200).json(productComments.comments);
}

export async function productCommentUpdate(req, res) {
  const productId = req.params.productId;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(404).json({ message: 'Cannot found Product' });

  const commentId = req.params.commentId;
  const comment = await prisma.commentProduct.findUnique({
    where: { id: articleId },
  });
  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  const commentUpdate = await prisma.commentProduct.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function productCommentDelete(req, res) {
  const productId = req.params.productId;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(404).json({ message: 'Cannot found Product' });

  const commentId = req.params.commentId;
  const comment = await prisma.commentProduct.findUnique({
    where: { id: articleId },
  });
  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  await prisma.commentProduct.delete({
    where: { id: commentId },
  });

  res.status(204).json(commentId);
}
