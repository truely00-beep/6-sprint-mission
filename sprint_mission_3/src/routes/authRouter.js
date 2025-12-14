import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);


export default authRouter;

// asyncHandler를 사용하면 밑에 코드로 표현할 수 있다. 
// authRouter.post("/register", async function(req, res, next) {
//     try {
//       await handler(req, res, next)
//     } catch(e) {
//       console.log('error 내용: ', e)
//       next(e)
//     }
//   });