import { Request, Response, NextFunction } from 'express';

// handler 함수가 어떤 모양인지 정의합니다.
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export function withAsync(handler: AsyncHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
