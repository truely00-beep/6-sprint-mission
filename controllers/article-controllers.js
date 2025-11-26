import prisma from '../lib/prismaclient.js';

export async function articleNew(req, res) {
  const articleCreate = await prisma.article.create({
    data: req.body,
  });

  res.status(201).json(articleCreate);
}

export async function articlesList(req, res) {
  const {
    offset = 0,
    limit = 5,
    order = 'newest',
    title = '',
    content = '',
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
      orderBy = { createdAt: 'desc' };
  }

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: title,
      },
      content: {
        contains: content,
      },
    },
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!articles) return res.status(401).json({ message: 'Cannot found List' });

  res.status(200).json(articles);
}

export async function articleOnly(req, res) {
  const id = req.params.id;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!article) return res.status(401).json({ message: `Cannot found ${id}` });

  res.status(200).json(article);
}

export async function articleUpdate(req, res) {
  const id = req.params.id;

  const article = await prisma.article.findUnique({ where: { id } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  const articleUpdate = await prisma.article.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json(articleUpdate);
}

export async function articleDelete(req, res) {
  const id = req.params.id;

  const article = await prisma.product.findUnique({ where: { id } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  await prisma.article.delete({
    where: { id },
  });

  res.status(204).json({ massage: `delete Article ${id}` });
}
