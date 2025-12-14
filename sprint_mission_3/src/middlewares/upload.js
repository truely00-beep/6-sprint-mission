// multer: 파일 업로드 처리 미들웨어
import multer from "multer";
// 경로 관련 유틸 함수들
import path from "path";
// 파일 시스템 (폴더 존재 확인, 폴더 생성 등)
import fs from "fs";

// uploads 저장 폴더 절대경로 생성
const uploadDir = path.join(process.cwd(), "uploads");
// console.log(uploadDir)

// upload 폴더 없으면 자동으로 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 브라우저에서 데이터가 들어오면 multer가 임시 file객체를 만듦.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

// upload = 파일을 지정한 폴더에 저장해주는 “업로드 미들웨어를 만들어내는 객체(upload)”
//그래서 아래처럼 .single(), .array(), .fields() 같은 메서드를 호출할 수 있게 됨.

export const upload = multer({ storage });


// 처음 임시 file객체 (클라이언트가 보내는 원본 요청)
// {
//   fieldname: "image",
//   originalname: "cat.png",
//   encoding: "7bit",
//   mimetype: "image/png",
//   // 아직 filename/destination 없음
// }

// 이후에 req.file 객체는 이렇게 됨 (next로 컨트롤러에 넘어갈때)
// req.file = {
//   fieldname: "image",
//   originalname: "cat.png",
//   mimetype: "image/png",
//   filename: "cat-982383.png",
//   destination: "/root/uploads",
//   path: '/root/uploads/cat-982383.png',
//   size: 123456
// }

// 이후에
// req.file = file;   // multer 내부 file 객체를 req.file로 할당
// 즉 multer를 거치고 나오면 req.file이 생김