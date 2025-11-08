const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads 폴더에 저장 (폴더 사전 생성 필요)
  },
  filename: (req, file, cb) => {
    // 파일명: timestamp-원본파일명으로 저장 (중복 방지)
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

// 파일 필터 (이미지 확장자만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 5MB 파일 크기 제한
  },
});

// 이미지 업로드 API (단일 파일)
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // 업로드된 파일 경로를 응답에 포함
    const imagePath = `/uploads/${req.file.filename}`;
    return res.status(201).json({ imagePath });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

