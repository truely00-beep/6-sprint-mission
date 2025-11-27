# 6-Sprint Mission 4: 토큰 기반 인증/인가 시스템

스프린트 미션 3을 기반으로 토큰 기반 유저 인증/인가 시스템과 좋아요 기능을 구현한 프로젝트입니다.

## 📋 목표

- 토큰 기반 유저 인증/인가 구현하기
- (심화) Refresh Token 구현하기
- (심화) Prisma로 관계형 활용하기 (좋아요 기능)

## ✨ 구현된 기능

### 기본 요구사항

#### 인증

- ✅ User 스키마 작성 (id, email, nickname, image, password, createdAt, updatedAt)
- ✅ 회원가입 API (`POST /users/signup`)
  - email, nickname, password 입력
  - password는 bcrypt로 해싱하여 저장
- ✅ 로그인 API (`POST /users/login`)
  - 로그인 성공 시 Access Token과 Refresh Token 발급

#### 상품 기능 인가

- ✅ 로그인한 유저만 상품 등록 가능
- ✅ 상품 등록 유저만 해당 상품 수정/삭제 가능

#### 게시글 기능 인가

- ✅ 로그인한 유저만 게시글 등록 가능
- ✅ 게시글 등록 유저만 게시글 수정/삭제 가능

#### 댓글 기능 인가

- ✅ 로그인한 유저만 상품/게시글에 댓글 등록 가능
- ✅ 댓글 등록 유저만 댓글 수정/삭제 가능

#### 유저 정보

- ✅ 유저가 자신의 정보 조회 (`GET /users/me`)
- ✅ 유저가 자신의 정보 수정 (`PATCH /users/me`)
- ✅ 유저가 비밀번호 변경 (`PATCH /users/me/password`)
- ✅ 유저가 자신이 등록한 상품 목록 조회 (`GET /users/me/products`)
- ✅ 비밀번호는 리스폰스에서 노출하지 않음

### 심화 요구사항

#### 인증

- ✅ Refresh Token으로 토큰 갱신 기능 (`POST /users/refresh`)

#### 좋아요 기능

- ✅ 로그인한 유저는 상품에 '좋아요' / '좋아요 취소' 가능 (`POST /likes/products/:id`)
- ✅ 로그인한 유저는 게시글에 '좋아요' / '좋아요 취소' 가능 (`POST /likes/articles/:id`)
- ✅ 조회 시 유저가 '좋아요' 누른 항목인지 확인 가능 (isLiked 필드 포함)
- ✅ 유저가 '좋아요' 표시한 상품 목록 조회 (`GET /likes/products`)

## 🛠 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: superstruct
- **File Upload**: multer

## 📁 프로젝트 구조

```
6-sprint-mission/
├── prisma/
│   ├── schema.prisma           # Prisma 스키마 정의
│   └── migrations/             # 데이터베이스 마이그레이션 파일
├── src/
│   ├── controllers/            # 컨트롤러
│   │   ├── articlesController.js
│   │   ├── commentsController.js
│   │   ├── errorController.js
│   │   ├── imagesController.js
│   │   ├── likesController.js
│   │   ├── productsController.js
│   │   └── usersController.js
│   ├── lib/                    # 유틸리티 및 미들웨어
│   │   ├── authMiddleware.js         # 인증 미들웨어
│   │   ├── optionalAuthMiddleware.js # 선택적 인증 미들웨어
│   │   ├── constants.js
│   │   ├── jwt.js                    # JWT 토큰 생성/검증
│   │   ├── prismaClient.js
│   │   ├── withAsync.js
│   │   └── errors/                   # 커스텀 에러
│   ├── routers/                # 라우터
│   │   ├── articlesRouter.js
│   │   ├── commentsRouter.js
│   │   ├── imagesRouter.js
│   │   ├── likesRouter.js
│   │   ├── productsRouter.js
│   │   └── usersRouter.js
│   ├── structs/                # 데이터 검증 구조
│   │   ├── articlesStructs.js
│   │   ├── commentsStruct.js
│   │   ├── commonStructs.js
│   │   ├── productsStruct.js
│   │   └── usersStruct.js
│   └── main.js                 # 서버 진입점
├── tests/                      # 테스트 파일
├── .env                        # 환경 변수
└── package.json

```

## 🚀 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 파일 생성 (.env.example 참고)
cp .env.example .env
```

### 2. 데이터베이스 설정

`.env` 파일에 데이터베이스 연결 정보를 설정합니다:

```env
DATABASE_URL=postgresql://[사용자명]@localhost:5432/panda-market
PORT=3000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

### 3. 데이터베이스 마이그레이션

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate deploy
```

### 4. 서버 실행

```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 📡 API 엔드포인트

### 인증 관련 (`/users`)

#### 회원가입

```http
POST /users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "nickname": "사용자",
  "password": "password123"
}
```

**응답:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자",
    "image": null,
    "createdAt": "2024-01-25T10:00:00.000Z",
    "updatedAt": "2024-01-25T10:00:00.000Z"
  }
}
```

#### 로그인

```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자",
    "image": null
  }
}
```

#### 토큰 갱신

```http
POST /users/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 실제 사용 가능한 코드 예제

**curl 명령어 예제:**

```bash
# 1. 회원가입
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","nickname":"테스트유저","password":"password123"}'

# 2. 로그인
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. 토큰 갱신
curl -X POST http://localhost:3000/users/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token-here"}'
```

**JavaScript/Node.js 예제:**

```javascript
// 1. 회원가입
const signupResponse = await fetch('http://localhost:3000/users/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    nickname: '테스트유저',
    password: 'password123',
  }),
});
const signupData = await signupResponse.json();

// 2. 로그인
const loginResponse = await fetch('http://localhost:3000/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }),
});
const { accessToken, refreshToken, user } = await loginResponse.json();

// 3. 토큰 갱신
const refreshResponse = await fetch('http://localhost:3000/users/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken }),
});
const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
```

**더 많은 예제는 `tests/auth-examples.js`와 `tests/auth-examples.sh` 파일을 참고하세요.**

#### API 엔드포인트 요약

| Method | Endpoint             | 설명                  | 인증 필요 |
| ------ | -------------------- | --------------------- | --------- |
| POST   | `/users/signup`      | 회원가입              | ❌        |
| POST   | `/users/login`       | 로그인                | ❌        |
| POST   | `/users/refresh`     | 토큰 갱신             | ❌        |
| GET    | `/users/me`          | 내 정보 조회          | ✅        |
| PATCH  | `/users/me`          | 내 정보 수정          | ✅        |
| PATCH  | `/users/me/password` | 비밀번호 변경         | ✅        |
| GET    | `/users/me/products` | 내가 등록한 상품 목록 | ✅        |

### 상품 관련 (`/products`)

| Method | Endpoint                 | 설명           | 인증 필요   |
| ------ | ------------------------ | -------------- | ----------- |
| POST   | `/products`              | 상품 등록      | ✅          |
| GET    | `/products`              | 상품 목록 조회 | ❌ (선택적) |
| GET    | `/products/:id`          | 상품 상세 조회 | ❌ (선택적) |
| PATCH  | `/products/:id`          | 상품 수정      | ✅          |
| DELETE | `/products/:id`          | 상품 삭제      | ✅          |
| POST   | `/products/:id/comments` | 상품 댓글 등록 | ✅          |
| GET    | `/products/:id/comments` | 상품 댓글 목록 | ❌          |

### 게시글 관련 (`/articles`)

| Method | Endpoint                 | 설명             | 인증 필요   |
| ------ | ------------------------ | ---------------- | ----------- |
| POST   | `/articles`              | 게시글 등록      | ✅          |
| GET    | `/articles`              | 게시글 목록 조회 | ❌ (선택적) |
| GET    | `/articles/:id`          | 게시글 상세 조회 | ❌ (선택적) |
| PATCH  | `/articles/:id`          | 게시글 수정      | ✅          |
| DELETE | `/articles/:id`          | 게시글 삭제      | ✅          |
| POST   | `/articles/:id/comments` | 게시글 댓글 등록 | ✅          |
| GET    | `/articles/:id/comments` | 게시글 댓글 목록 | ❌          |

### 댓글 관련 (`/comments`)

| Method | Endpoint        | 설명      | 인증 필요 |
| ------ | --------------- | --------- | --------- |
| PATCH  | `/comments/:id` | 댓글 수정 | ✅        |
| DELETE | `/comments/:id` | 댓글 삭제 | ✅        |

### 좋아요 관련 (`/likes`)

| Method | Endpoint              | 설명                    | 인증 필요 |
| ------ | --------------------- | ----------------------- | --------- |
| POST   | `/likes/products/:id` | 상품 좋아요/취소        | ✅        |
| POST   | `/likes/articles/:id` | 게시글 좋아요/취소      | ✅        |
| GET    | `/likes/products`     | 내가 좋아요한 상품 목록 | ✅        |

## 🔐 인증 방식

### Access Token

- JWT 기반 토큰 인증
- 만료 시간: 15분
- 헤더에 `Authorization: Bearer {token}` 형식으로 전송

### Refresh Token

- Access Token 갱신용 토큰
- 만료 시간: 7일
- `/users/refresh` 엔드포인트로 토큰 갱신

## 🗄 데이터베이스 스키마

### User

- id, email, nickname, image, password, createdAt, updatedAt
- articles, products, comments, likedProducts, likedArticles 관계

### Product

- id, name, description, price, tags, images, userId, createdAt, updatedAt
- user, ProductComment, likes 관계

### Article

- id, title, content, image, userId, createdAt, updatedAt
- user, ArticleComment, likes 관계

### Comment

- id, content, userId, productId, articleId, createdAt, updatedAt
- user, product, article 관계

### ProductLike

- id, userId, productId, createdAt
- user, product 관계 (unique 제약)

### ArticleLike

- id, userId, articleId, createdAt
- user, article 관계 (unique 제약)

## 📝 주요 변경사항

### 미션 3 이후 변경사항

1. **디렉토리 구조 유지**: 기존 구조를 유지하면서 인증/인가 기능 추가
2. **토큰 기반 인증**: JWT를 사용한 토큰 기반 인증 시스템 구현
3. **JWT 슬라이딩 세션**: Refresh Token으로 Access Token과 Refresh Token 재발급
4. **비밀번호 변경**: 현재 비밀번호와 새로운 비밀번호를 입력하여 변경 가능

## 🎯 테스트

API 테스트는 `tests/test.http` 파일을 참고하세요.

## 📸 스크린샷

(스크린샷 이미지 추가 예정)

## 💡 개선 사항 및 고민

### 코드 구조

- 라우터 파일의 가독성 개선 필요
- 미들웨어 통합 고려 (현재 authMiddleware, optionalAuthMiddleware 분리)

### 서비스 레이어

- LMS에서 제안하는 userService.js 패턴 적용 검토
- 현재는 컨트롤러에 비즈니스 로직이 포함되어 있어 복잡도가 높음

### 향후 개선 계획

1. 서비스 레이어 도입으로 컨트롤러 단순화
2. 미들웨어 통합 및 재사용성 향상
3. 에러 핸들링 표준화
4. 테스트 코드 작성

## 📚 참고 자료

- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
