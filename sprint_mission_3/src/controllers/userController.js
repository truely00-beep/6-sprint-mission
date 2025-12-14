import { asyncHandler } from "../middlewares/asyncHandler.js";
import { PatchUser } from '../struct.js'
import { assert } from 'superstruct'
import { 
  getMyUserService,
  updateMyUserService,
  updatePasswordService,
  getMyProductsService
 } from '../services/userService.js'

// 여기서는 req.user.id를 사용

/**
 * 유저가 자신의 정보를 조회
 */
export const getUser = asyncHandler(async(req, res) => {
  const user = await getMyUserService(req.user.id);

  return res.status(200).json(user)
})


/**
 * 유저가 자신의 정보를 수정 
 */

export const patchUser = asyncHandler(async(req, res) => {
  assert(req.body, PatchUser)

  const user = await updateMyUserService({
    userId: req.user.id, // 미들웨어가 넣어준 값
    userData: req.body // ex) req.body = { nickname: "철수", email: "charles@gmail.com" }
  })
  
  return res.status(200).json({ user })
})


/**
 * 유저가 자신의 비밀번호를 변경
 */
// 비밀번호를 변경하고 -> hashing해서 저장 -> "res으로 비밀번호가 변경되었습니다." 출력
export const patchPassword = asyncHandler(async(req, res) => {
  assert(req.body, PatchUser);
  // console.log(req.user.id)
  // console.log(req.body)
  await updatePasswordService({
    userId: req.user.id,
    password: req.body.password,
  })

  return res.status(200).json({ message: '비밀번호가 변경되었습니다.' })
})


/**
 * 유저가 자신이 등록한 상품의 목록을 조회하는 기능 
 * 이거는 어디서 구현했는지 찾아보기
 */
export const getProductList = asyncHandler(async(req, res) => {
  const products = await getMyProductsService(req.user.id);
  return res.status(200).json(products);
})

