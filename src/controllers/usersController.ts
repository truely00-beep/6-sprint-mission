import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UserService } from '../services/userService.js';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

const userService = new UserService();

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await userService.getMe(req.user.id);
  res.send(user);
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, UpdateMeBodyStruct);
  const user = await userService.updateMe(req.user.id, data);
  res.status(200).send(user);
}

export async function updateMyPassword(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, UpdatePasswordBodyStruct);
  await userService.updatePassword(req.user.id, data);
  res.status(200).send();
}

export async function getMyProductList(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const params = create(req.query, GetMyProductListParamsStruct);
  const result = await userService.getMyProductList(req.user.id, params);
  res.send(result);
}

export async function getMyFavoriteList(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const params = create(req.query, GetMyFavoriteListParamsStruct);
  const result = await userService.getMyFavoriteList(req.user.id, params);
  res.send(result);
}

