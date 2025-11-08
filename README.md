# Express PostgreSQL Marketplace & Board API

## 프로젝트 개요
이 프로젝트는 Express.js와 PostgreSQL을 이용한 중고마켓 및 자유게시판 웹 애플리케이션의 백엔드 API 서버입니다. 이미지 업로드, 댓글 기능, 페이징, 검색 필터링, 그리고 데이터 시딩 기능을 포함합니다.

## 주요 기능
- 중고마켓 및 자유게시판 CRUD API
- 이미지 파일 업로드(multer)
- 댓글 기능
- 페이징 처리 (offset, cursor 기반)
- 검색 필터링
- 유효성 검증 및 에러 핸들링 미들웨어
- 초기 데이터 시딩 스크립트 제공

## 파일 구조

## 설치 및 실행 방법

1. 저장소 클론 및 의존성 설치

2. 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성 후 PostgreSQL 접속 정보 및 기타 설정 추가

3. 데이터베이스 마이그레이션 및 시딩

4. 서버 시작

## API 주요 엔드포인트
- `/market` 중고마켓 관련 REST API
- `/board` 자유게시판 관련 REST API
- `/commentMarket`, `/commentBoard` 댓글 관련 API
- `/upload` 이미지 업로드

## 페이징 및 검색
- `utils/pagination.js`에서 offset 및 cursor 기반 페이징 로직 제공
- `utils/search.js`에서 다양한 검색 필터링 기능 구현

## 에러 처리 및 유효성 검증
- `middlewares/errorHandler.js`에서 중앙집중식 에러 처리
- `middlewares/validation.js`에서 요청 데이터 유효성 검사 미들웨어 사용

## 이미지 업로드
- `config/multer.js` 설정을 통해 이미지 업로드 관리
- `routes/upload.js`에서 이미지 업로드 라우트 제공

## 기여
버그 리포트나 기능 요청 시 이슈 등록 또는 풀 리퀘스트 보내주세요.

## 라이선스
MIT 라이선스
