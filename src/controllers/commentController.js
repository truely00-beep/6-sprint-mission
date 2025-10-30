import { skip } from '@prisma/client/runtime/library';
import prisma from '../src/lib/prismaClient.js';

//create<제목>Comment //create<제목>Comment
//getlist<제목>Comment //getlist<제목>Comment
//patchCommentById
//deleteCommentById
/**
200 OK: 일반적인 성공 (GET, UPDATE 후)
201 Created: 새로운 리소스 생성 성공 (POST)
204 No Content: 성공했지만 돌려줄 데이터가 없음 (DELETE)
400 Bad Request: 클라이언트 요청 오류 (유효성 검사 실패 등)
404 Not Found: 요청한 리소스가 없음
 */

//POST
// const createCommentForProduct = async (req,res) => {
//     const inputData = req.body
//     try {
//         await Prisma.comment.create({
//             data: {}
//                 inputData
//         })
//     }
// }

// const createCommentForArticle = async (req, res, next) => {
//     try{

//     }catch(error){
//         return next(error)
//     }
// }

//GET
// const getlist
// const getCommentArticle= async (req, res, next) => {
//     try{

//     }catch(error){
//         return next(error)
//     }
// }

const getCommentProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 0 } = req.query;

    const comments = await prisma.comment.findMany({
      where: id,
      //   where: { productId: id },
      //   cursor: { id: cursor },
      take: parseInt(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).send(comments);
  } catch (error) {
    return next(error);
  }
};

//GET id
// = async (req, res, next) => {
//     try{

//     }catch(error){
//         return next(error)
//     }
// }

//PATCH id
// = async (req, res, next) => {
//     try{

//     }catch(error){
//         return next(error)
//     }
// }

// //DELETE id
// = async (req, res, next) => {
//     try{

//     }catch(error){
//         return next(error)
//     }
// }

// export {};
