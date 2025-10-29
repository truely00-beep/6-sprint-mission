import { Prisma } from '@prisma/client';
//import asyncHandler from 'express-async-handler';

/**
200 OK: 일반적인 성공 (GET, UPDATE 후)
201 Created: 새로운 리소스 생성 성공 (POST)
204 No Content: 성공했지만 돌려줄 데이터가 없음 (DELETE)
400 Bad Request: 클라이언트 요청 오류 (유효성 검사 실패 등)
404 Not Found: 요청한 리소스가 없음
 */

//POST
const createArticle = async (req, res) => {
  const inputData = req.body;
  const articleData = await Prisma.article.create({
    data: inputData,
  });
  res.status(201).send({ message: '게시글이 안전하게 등록되었습니다.', data: articleData });
};

//GET
const getListArticles = async (req, res) => {
  const { offset = 0, limit = 0 } = req.query;
  const articleData = await Prisma.article.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.status(200).send({ message: '게시글 목록 불러오기, 성공!', data: articleData });
};

//GET id
const getArticleById = async (req, res) => {
  const id = req.params.id;
  const articleData = await Prisma.article.findUnique({
    where: { id },
  });
  if (!articleData) {
    return res.status(404).send('에러!: 게시글을 찾을 수 없습니다. :( ');
  } else res.status(200).send({ message: '게시글 불러오기, 성공!', data: articleData });
};

//PATCH id
const patchArticleById = async (req, res, next) => {
  const id = req.params.id;
  const inputData = req.body;
  try {
    await Prisma.article.update({
      where: { id },
      data: inputData,
    });
    //   if (!articleData) {
    //     return res.status(404).send('에러!: 게시글을 찾을 수 없습니다. :( '); } else
    res.status(200).send({ message: '게시글 수정, 성공!' });
  } catch (error) {
    return next(error);
  }
};

//DELETE id
const deleteArticleById = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Prisma.article.delete({
      where: { id },
    });
    //   if (!articleData) {
    // return res.status(404).send('에러!: 게시글을 찾을 수 없습니다. :( ');} else
    res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export { createArticle, getListArticles, getArticleById, patchArticleById, deleteArticleById };
