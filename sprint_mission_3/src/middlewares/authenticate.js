import { prisma } from '../lib/prismaClient.js'
import { verifyAccessToken } from '../lib/token.js'
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js'
import { asyncHandler } from './asyncHandler.js'

// 브라우저로부터 넘어온 토큰을 검사하고 유저 db에 있는지 확인 후 req.user = user로 다음 미들웨어에 넘겨줌.
export const authenticate = asyncHandler(async(req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME]

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { userId } = verifyAccessToken(accessToken) // 실패 시 asyncHandler가 잡음

  const user = await prisma.user.findUnique({ where: { id: userId }}) // 실패 시 asyncHandler가 잡음

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  req.user = user
  // console.log("여기까지")
  // console.log('authenticate에서 req.user 찍은 결과 :', req.user)
  next()
})


// req.user = {
//   id: 1,
//   email: 'qkrrjstns23@gmail.com',
//   nickname: '박건순',
//   password: '$2b$10$w/o0v52ymo641D2y5I/gHOMwSYGGFTKz980vRePhZXrT21jwwUeA6',
//   createdAt: 2025-12-12T14:33:58.909Z,
//   updatedAt: 2025-12-12T14:33:58.909Z
// }