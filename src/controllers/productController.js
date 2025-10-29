import { PrismaClientExtends } from '@prisma/client/extension';
import prisma from '../lib/prismaClient.js';
/**
200 OK: 일반적인 성공 (GET, UPDATE 후)
201 Created: 새로운 리소스 생성 성공 (POST)
204 No Content: 성공했지만 돌려줄 데이터가 없음 (DELETE)
400 Bad Request: 클라이언트 요청 오류 (유효성 검사 실패 등)
404 Not Found: 요청한 리소스가 없음
 */

//POST
const createProduct = async (req, res) => {
  const inputData = req.body;
  const productData = await prisma.product.create({
    data: inputData,
  });
  res.status(201).send({ message: '상품이 안전하게 등록되었습니다.', data: productData });
};

//GET
const getListProducts = async (req, res, next) => {
  const { offset = 0, limit = 0, order = 'recent' } = req.query;
  let orderBy;
  switch (order) {
    case 'recent': {
      orderBy = { createdAt: 'desc' };
      break;
    }
    case 'oldest': {
      orderBy = { createdAt: 'asc' };
      break;
    }
    default:
      orderBy = { createdAt: 'desc' };
  }

  try {
    const productData = await prisma.product.findMany({
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    res.status(200).send({ message: '판매 제품 목록 불러오기, 성공!', data: productData });
  } catch (error) {
    return next(error);
  }
};

//GET id
const getProductById = async (req, res, next) => {
  const id = req.params.id;
  const productData = await prisma.product.findUnique({
    where: { id },
  });
  if (!productData) {
    return res.status(404).send('에러!: 제품을 찾을 수 없습니다. :( ');
  } else res.status(200).send({ message: '판매 제품 불러오기, 성공!', data: productData });
};

//PATCH id
const patchProductById = async (req, res, next) => {
  const id = req.params.id;
  const inputData = req.body;
  try {
    await prisma.product.update({
      where: { id },
      data: inputData,
    });
    // if (!productData) {
    // return res.status(404).send('에러!: 제품을 찾을 수 없습니다. :( ');} else
    res.status(200).send({ message: '판매 제품 수정, 성공!' });
  } catch (error) {
    return next(error);
  }
};

//DELETE id
const deleteProductById = async (req, res, next) => {
  const id = req.params.id;
  try {
    await prisma.product.delete({
      where: { id },
    });
    // if (!productData) {
    //   return res.status(404).send('에러!: 제품을 찾을 수 없습니다. :( ');} else
    res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export { createProduct, getListProducts, getProductById, patchProductById, deleteProductById };
