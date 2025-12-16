# Pandamarket Backend - Sprint Mission 5

TypeScript로 마이그레이션된 Express.js 백엔드 프로젝트입니다.

## 주요 변경사항

### TypeScript 마이그레이션
- 모든 JavaScript 파일을 TypeScript로 변환
- 타입 안정성 확보 및 인터페이스/타입 별칭 활용
- `any` 타입 최소화

### Layered Architecture 적용
- **Repository 계층**: 데이터베이스 접근 로직
- **Service 계층**: 비즈니스 로직
- **Controller 계층**: HTTP 요청/응답 처리
- **DTO**: 계층 간 데이터 전송 객체

## 프로젝트 구조

```
src/
├── controllers/     # HTTP 요청/응답 처리
├── services/        # 비즈니스 로직
├── repositories/   # 데이터베이스 접근
├── routers/         # 라우팅 설정
├── middlewares/     # 미들웨어
├── lib/            # 유틸리티 및 상수
├── structs/        # superstruct 검증 스키마
└── types/          # TypeScript 타입 정의
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Prisma 클라이언트 생성
```bash
npm run prisma:generate
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
DATABASE_URL="postgresql://..."
JWT_ACCESS_TOKEN_SECRET="your-secret"
JWT_REFRESH_TOKEN_SECRET="your-secret"
PORT=3000
NODE_ENV=development
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 프로덕션 빌드
```bash
npm run build
npm start
```

## 사용된 기술 스택

- **TypeScript**: 타입 안정성
- **Express.js**: 웹 프레임워크
- **Prisma**: ORM
- **bcrypt**: 비밀번호 해싱
- **jsonwebtoken**: JWT 토큰
- **superstruct**: 데이터 검증
- **multer**: 파일 업로드
- **ts-node**: TypeScript 직접 실행
- **nodemon**: 개발 서버 자동 재시작

## API 엔드포인트

- `/auth` - 인증 관련
- `/users` - 사용자 관련
- `/products` - 상품 관련
- `/articles` - 게시글 관련
- `/comments` - 댓글 관련
- `/images` - 이미지 업로드

## 개발 환경 설정

- **ts-node**: `.ts` 파일을 직접 실행
- **nodemon**: 파일 변경 시 자동 재시작
- **TypeScript**: 엄격한 타입 검사 활성화

