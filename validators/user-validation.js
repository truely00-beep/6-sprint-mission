import { assert } from 'superstruct';
import { CreateUser } from '../structs/userStructs.js';

export function userCreateValidation(req, res, next) {
  try {
    assert(req.body, CreateUser);
    next();
  } catch (err) {
    res.status(400).json({
      message: 'Invalid Request body',
      details: err.message,
    });
  }
}
