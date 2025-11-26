import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import ValidationError from '../lib/errors/ValidationError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

export function defaultNotFoundHandler(req, res, next) {
  return res.status(404).send({ message: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: err.message });
  }

  /** Prisma error codes */
  if (err.code) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }

  /** Application error */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  //입력 데이터 검증 실패
  if (err instanceof ValidationError) {
    return res.status(400).send({ message: err.message });
  }

  //중복된 데이터 존재
  if (err instanceof ConflictError) {
    return res.status(409).send({ message: err.message });
  }

  //인증/인가 실패 (비밀번호 불일치)
  if (err instanceof UnauthorizedError) {
    return res.status(401).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
