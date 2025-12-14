import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV
} from './constants.js';

// res.cookie()의 역할은 브라우저에게 보낼 응답 헤더에 Set-Cookie를 추가하는 것
// 실제 전송은 안했다. 세팅만 해둠.
export function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 20 * 60 * 60 * 1000,
  }); 

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh',
  });
}

// HTTP 응답 헤더에 아래 내용을 추가 
// Set-Cookie: access_token=aaa.bbb.ccc;
//             HttpOnly;
//             Max-Age=72000;
//             SameSite=Lax;
//             Secure

// 응답 헤더에 나가는 형식 (서버 -> 브라우저)
// HTTP/1.1 200 OK
// Set-Cookie: accessToken=aaa.bbb.ccc; Max-Age=72000; Path=/; HttpOnly; SameSite=Lax
// Set-Cookie: refreshToken=ddd.eee.fff; Max-Age=604800; Path=/auth/refresh; HttpOnly; SameSite=Lax

// (브라우저 -> 서버) // 요청에는 토큰만 온다.(옵션 안옴)
// GET /some-api
// Cookie: access_token=aaa.bbb.ccc



// res.clearCookie()도 응답헤더에 Set-Cookie를 추가하는 작업인데 여기서는
// 토큰의 만료기간을 1970년대로 돌린다. 그래서 이전에 만들어준 refresh토큰을 1970년대로 돌려야하기 때문에
// refresh 토큰을 생성했던 곳에 있는 refresh 토큰을 만료 시켜야되는 것이다.
export const clearTokenCookies = (res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME , {
    path: '/auth/refresh'
  })
}
// accessToken 쿠키의 만료 시점을 과거로 돌려서 브라우저가 즉시 삭제하게 만드는거다.
// Set-Cookie: access_token=;  //토큰 값은 비워둠(응답 헤더로 보낼거니까 토큰은 없어야한다)
//             Expires=Thu, 01 Jan 1970 00:00:00 GMT;
//             Path=/

// 값을 유지한 채 만료시키는 게 아니라, 값을 비우고 + 만료를 과거로 돌려서 삭제 지시를 한다.