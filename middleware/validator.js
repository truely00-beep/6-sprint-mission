// middleware/validator.js
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const { BadRequestError } = require("./CustomError");

// --- Joi 스키마 정의 ---

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().label("상품 이름"),
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .label("상품 설명"),
  price: Joi.number().integer().min(0).required().label("가격"),
  // tags는 쉼표로 구분된 문자열로 받고 컨트롤러에서 배열로 변환
  tags: Joi.string().allow("").optional().label("태그"),
});

const articleSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().label("제목"),
  content: Joi.string().trim().min(10).max(5000).required().label("내용"),
});

const commentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required().label("댓글 내용"),
});

// --- Joi 유효성 검증 미들웨어 ---

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true, // 스키마에 없는 필드 제거
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/["\\]/g, ""),
      }));
      return next(new BadRequestError("유효성 검증에 실패했습니다.", details));
    }
    next();
  };

// --- Multer 파일 업로드 설정 ---

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 실제 운영 환경에서는 AWS S3 등의 클라우드 스토리지를 사용해야 합니다.
    cb(null, "uploads/"); // 서버에 파일을 저장할 디렉토리
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${path.basename(file.originalname, ext)}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new BadRequestError("이미지 파일만 업로드할 수 있습니다."),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = {
  validateProduct: validate(productSchema),
  validateArticle: validate(articleSchema),
  validateComment: validate(commentSchema),
  uploadImage: upload.single("image"), // 'image'는 form-data 필드 이름
};
