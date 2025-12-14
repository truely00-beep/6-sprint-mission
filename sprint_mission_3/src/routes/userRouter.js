import express from "express";
import { getUser, patchUser, patchPassword, getProductList } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";


const userRouter = express.Router();


// 유저 조회
userRouter.get("/me", authenticate, getUser);

// 유저 정보 변경
userRouter.patch("/me", authenticate, patchUser);

// 유저 비밀번호 변경
userRouter.patch("/me/password", authenticate, patchPassword)

// 유저가 자신이 등록한 상품의 목록을 조회
userRouter.get("/me/products", authenticate, getProductList)



export default userRouter;
