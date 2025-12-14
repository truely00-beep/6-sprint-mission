import { asyncHandler } from '../middlewares/asyncHandler.js';
import { setTokenCookies, clearTokenCookies } from '../lib/cookies.js';
import {
  REFRESH_TOKEN_COOKIE_NAME
} from '../lib/constants.js'
import { assert } from 'superstruct';
import { CreateUser } from '../struct.js';
import { 
  registerUserService,
  loginUserService,
  refreshAccessTokenService
} from '../services/authService.js';


/**
 * 회원 가입
 */
export const register = asyncHandler(async(req, res) => {
  assert(req.body, CreateUser)
  const { email, nickname, password } = req.body;
  // const email = req.body.email;
  const user = await registerUserService({ // service에서 오류가 나면 handler의 catch(e)가 잡음
    email, 
    nickname, 
    password
  })

  return res.status(201).json(user) 
})

// service함수에는 밑에와 같은 객체 아규먼트가 전달된다.
// {
//   email: "test@test.com",
//   nickname: "민수",
//   password: "1234"
// }


/**
 * 로그인 (Set-Cookies에 토큰 넣어서 브라우저에게 전달)
 */
export const login = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  // console.log('email : ',email)

  // authServices에서 accessToken, refreshToken을 return 한다.
  const { accessToken, refreshToken } = await loginUserService({ email, password })
  // console.log('controller의 accessToken: ', accessToken)
  // console.log('controller의 refreshToken: ', refreshToken)
  
  // 여기서는 쿠키에 싣기만 한다.
  // setTokenCookies에서 return으로 오지 않더라도 동기적으로 끝났기 때문에 그냥 다음줄로 실행 가능하다.
  setTokenCookies(res, accessToken, refreshToken) // 헤더 세팅

  // 이 순간에 (헤더 + 상태코드)가 같이 나가면서 브라우저가 쿠키를 저장한다.
  return res.sendStatus(200) // 응답 전송 이때 Set-Cookie 헤더도 같이 나감. 
})


/**
 * refresh 토큰을 이용하여 access_token 발급받기
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  // app.use(cookieParser())가 req.cookie 객체로 만들어줌

  // console.log('req.cookies 객체 : ', req.cookies) // req.cookies: { 'refresh-token' : 'eykjw...' }
  // console.log('refresh로 access 만들때 들어온 refreshToken: ', token)

//   req.cookies = {
//   accessToken: "aaa.bbb.ccc",
//   refreshToken: "ddd.eee.fff"
// }

  const { accessToken, refreshToken } =
  await refreshAccessTokenService(token);

  // setTokenCookies는 보낼 응답 헤더에 Set-Cookie를 추가하는 작업
  setTokenCookies(res, accessToken, refreshToken);
  // 브라우저로 보냄 (헤더 + 상태코드)
  return res.sendStatus(200);
})


/**
 * 로그아웃
 */
export const logout = asyncHandler(async(req, res) => {
  clearTokenCookies(res)
  return res.sendStatus(200);
})


