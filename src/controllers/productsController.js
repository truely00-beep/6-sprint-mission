import { prisma } from '@prisma/client';
//import asyncHandler from 'express-async-handler';
//createProduct
//getAllProducts getProductById
//patchProductsById
//deleteProductById
/**
200 OK: 일반적인 성공 (GET, UPDATE 후)
201 Created: 새로운 리소스 생성 성공 (POST)
204 No Content: 성공했지만 돌려줄 데이터가 없음 (DELETE)
400 Bad Request: 클라이언트 요청 오류 (유효성 검사 실패 등)
404 Not Found: 요청한 리소스가 없음
 */

//POST
export const postNewProduct = async (req, res) => {
  const inputData = req.body;
  const newProduct = await prisma.products.create({
    data: inputData,
  });
  res.status(201).send({ message: '상품이 안전하게 등록되었습니다.', data: newProduct });
};

//GET
export const getAllProducts = async (req, res) => {
  const { offset = 0, limit = 0 } = req.query;
  const getProductData = await prisma.products.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.status(200).send({ message: '판매 제품 목록 불러오기, 성공!', data: getProductData });
};

//GET id
export const getProductById = async (req, res) => {
  const id = req.params.id;
  const getProductData = await prisma.products.findUnique({
    where: { id },
  });
  res.status(200).send({ message: '판매 제품 불러오기, 성공!', data: getProductData });
};

//PATCH id
export const patchProductById = async (req, res) => {
  const id = req.params.id;
  const inputData = req.body;
  const patchProductData = await prisma.products.update({
    where: { id },
    data: inputData,
  });
  res.status(200).send({ message: '판매 제품 수정, 성공!', data: patchProductData });
};

//DELETE id
export const deleteProductById = async (req, res) => {
  const id = req.params.id;
  const deletedProductData = await prisma.products.delete({
    where: { id },
  });
  res.status(204).end();
};
