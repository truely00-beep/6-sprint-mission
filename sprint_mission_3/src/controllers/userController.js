import { prisma } from "../lib/prismaClient.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { PatchUser } from '../struct.js'
import { assert } from 'superstruct'
import bcrypt from 'bcrypt'

// 여기서는 req.user.id를 사용

// 유저가 자신의 정보를 조회
export const getUser = asyncHandler(async( req, res) => {
  // const user = req.user (authenticate에서 넘어온 req.user를 이용)
  const userId = req.user.id
  
  const user = await prisma.user.findUnique({
    where: { id: userId},
    select: {
      email: true,
      nickname: true
    }
  })

  res.status(200).send(user)
})

// 유저가 자신의 정보를 수정 
export const patchUser = asyncHandler(async(req, res) => {
  assert(req.body, PatchUser)
  const updated_data = req.body
  // 토큰을 통해 로그인 한 유저가 누구인지 확인 후 넘어온 req.user를 이용
  const userId = req.user.id
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updated_data
    },
    select: {
      email: true,
      nickname: true
    }
  }) 
  res.status(200).json({ user })
})


// 유저가 자신의 비밀번호를 변경
// 비밀번호를 변경하고 -> hashing해서 저장 -> "res으로 비밀번호가 변경되었습니다." 출력
export const patchPassword = asyncHandler(async(req, res) => {
  assert(req.body, PatchUser)
  const userId = req.user.id
  const { password } = req.body
  // console.log("이전 해싱 비밀번호 :", req.user.password)
  // console.log("바꾸고 싶은 평문 비밀번호 :", password)
  
  // plain_password를 해싱.
  const hashed_password = await hashing_password(password)

  const updatedPasswordUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed_password
    }
  })
  // console.log("바뀐 해싱 비밀번호: ", updatedPasswordUser.password)
  res.status(200).send({ message: "비밀번호가 변경되었습니다." })
})

async function hashing_password(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}


// 유저가 자신이 등록한 상품의 목록을 조회하는 기능
export const getProductList = asyncHandler(async(req, res) => {
  const userId = req.user.id
  const productList = await prisma.user.findMany({
    where: { id: userId },
    select: {
      products: {
        select: {
          name: true,
          description: true,
          price: true
        }
      }
    }
  })
  
  res.status(200).json(productList)

})

