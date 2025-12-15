## 요구사항

## 기본

- [x] tsconfig.json 파일 생성 및 옵션 설정
- [x] 필요한 npm script 설정 (build, start, dev)
- [x] 개발 환경 설정 (ts-node, nodemon을 활용한 서버 실행)
- [x] 필요한 타입 패키지 설치 (typescript, @types/node, @types/express 등)
- [ ] 기존 Express.js 프로젝트를 TypeScript로 마이그레이션
- [x] src/lib 폴더 마이그레이션
- [x] src/structs 폴더 마이그레이션
- [ ] src/middlewares 폴더 마이그레이션
- [ ] src/controllers 폴더 마이그레이션
- [ ] src/routers 폴더 마이그레이션
- [ ] src/main.js 및 기타 설정 파일 마이그레이션
- [ ] any 타입 사용 최소화
- [ ] 복잡한 객체/배열에 인터페이스 또는 타입 별칭(Type Alias) 적용
- [ ] 필요시 declare를 사용하여 타입 오버라이드/확장 (예: req.user)

## 심화

- [ ] Layered Architecture 적용하기 (Controller, Service, Repository 분리)
- [ ] 계층 간 데이터 전달 시 DTO 활용

## 주요 변경사항

- 자바스크립트(js) 기반의 Express 프로젝트를 타입스크립트(ts)로 전환했습니다.
- tsconfig.json을 통해 엄격한 타입 검사(strict: true) 환경을 구축했습니다.
- superstruct를 활용한 데이터 검증 로직에 타입을 적용하여 안정성을 높였습니다.

## 셀프 코드 리뷰를 통해 질문 이어가겠습니다.

- gpt를 통해 할 수 있는데까지, 이해할 수 있는 부분까지 진행했습니다.
- 현재 lib과 structs 폴더까지 변환을 마쳤고, controllers와 middlewares 변환을 진행 중입니다.
- 타입 정의가 까다로운 부분(Express Request 확장 등)에 대해 조언 부탁드립니다.
