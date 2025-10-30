// 미들웨어 함수는 (req, res, next) 3개의 인자를 받습니다.
// next: "다음 미들웨어 또는 라우트 핸들러로 제어권을 넘기는" 함수
export const validatePagination = (req, res, next) => {
  const { offset = 0, limit = 10 } = req.query;

  // 숫자로 변환
  const _offset = parseInt(offset);
  const _limit = parseInt(limit);

  // 유효성 검사
  if (_limit <= 0) {
    // 400 에러를 반환, 함수 종료
    return res.status(400).send({
      message: 'limit 쿼리 파라미터는 0보다 큰 정수여야 합니다.',
    });
  }

  if (_offset < 0) {
    // 400 에러를 반환, 함수 종료
    return res.status(400).send({
      message: 'offset 쿼리 파라미터는 0 이상의 정수여야 합니다.',
    });
  }

  // 유효성 검사 통과 후, 가공된 데이터 전달
  // 이 미들웨어에서 이미 검증하고 숫자로 바꾼(_offset, _limit) 값을
  // req 객체에 `paginationParams`라는 이름으로 저장
  // (이러면 다음 로직에서 parseInt를 또 할 필요가 없어짐)
  req.paginationParams = {
    offset: _offset,
    limit: _limit,
  };

  // API 로직으로 제어권 넘기기
  next();
};
