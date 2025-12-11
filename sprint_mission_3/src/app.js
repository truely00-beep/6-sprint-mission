import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import productRouter from "./routes/productRouter.js";
import articleRouter from "./routes/articleRouter.js";
import commentRouter from "./routes/commentRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorHandler);
app.listen(3000, () => console.log("Server Start"));


