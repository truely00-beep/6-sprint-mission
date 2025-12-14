import jwt from 'jsonwebtoken'
import { 
  JWT_ACCESS_TOKEN_SECRET ,
  JWT_REFRESH_TOKEN_SECRET
} from './constants.js'


export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "20h", // payload에는 userId를 넣는다.
  })                  // header는 jsonwebtoken이 자동으로 만들어줌.
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d"
  })
  // console.log('accessToken, refreshToken: ', { accessToken, refreshToken })
  return { accessToken, refreshToken }
}
// 실제 반환값은 이렇게 생김
// { 
//   accessToken: "aaa.bbb.ccc",
//   refreshToken: "ddd.eee.fff"
// }


export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET)
  return { userId: decoded.id }
}

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET)
  return { userId: decoded.id } // 로그인 했던 user가 누구인지 확인 가능
}
// decoded는 JWT의 payload 객체다.

// 토큰 생성
// jwt.sign(
//   { id: userId }, // payload (userId=123)               
//   JWT_REFRESH_TOKEN_SECRET,
//   { expiresIn: "1d" }
// )

// decoded는 JWT의 payload 객체
// decoded = {
//   id: 123, 넣었던 payload의 userId값
//   iat: 1710000000,    // issued at (자동)
//   exp: 1710086400     // expires at (자동)
// }