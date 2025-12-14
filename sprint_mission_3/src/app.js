import express from "express";
import path from "path"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import productRouter from "./routes/productRouter.js";
import articleRouter from "./routes/articleRouter.js";
import commentRouter from "./routes/commentRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";


const app = express();

// 경로를 명시하는게 더 안전하고 직관적이다.
const __dirname = process.cwd()

// 이미지 정적 제공 설정 (서버의 uploads폴더를 외부에서 접근 가능하게 해줌)
// 서버 내부의 uploads 폴더를 외부에서 /uploads/파일명 URL로 접근 가능하게 만드는 설정
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// 프론트에서 <img src="http://localhost:3000/uploads/파일이름.png" /> 로 바로 볼 수 있다.

app.use(express.json());

// 브라우저가 보낸 req.headers.cookie의 문자열을 cookie-parser 미들웨어가 파싱해서
// req.cookies라는 객체 형태로 만들어 준다.
app.use(cookieParser());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);


app.use(errorHandler);
app.listen(3000, () => console.log("Server Start"));


//// middlewares/upload.js에서 이 작업을 대체했다(나중에 지우기) ////

// // 파일이 저장되는 위치를 정해야한다 (multer 객체)
// const upload = multer({ dest: 'uploads/'})
// app.post('/files', upload.single('attachment'), (req, res) => {
//   const path = `/files/${req.file.filename}`
//   res.json({ path })
// })
