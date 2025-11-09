import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStruct.js';

const prisma = new PrismaClient();

export const getArticles = async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent' } = req.query;
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: order === 'recent' ? 'desc' : 'asc' },
    skip: parseInt(offset),
    take: parseInt(limit),
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  res.json(articles);
};

export const getArticleById = async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  res.json(article);
};

export const createArticle = async (req, res) => {
  assert(req.body, CreateArticle);
  const article = await prisma.article.create({ data: req.body });
  res.status(201).json(article);
};

export const updateArticle = async (req, res) => {
  assert(req.body, PatchArticle);
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(article);
};

export const deleteArticle = async (req, res) => {
  await prisma.article.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
