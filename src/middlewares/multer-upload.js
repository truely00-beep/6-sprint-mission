/**
 * src/middlewares/upload.js
 * Multer를 사용한 이미지 업로드 미들웨어 설정
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError.js';
import { BAD_REQUEST } from '../constants/status.js';

// 업로드 디렉토리 설정
const uploadDir = 'uploads';

// 디스크 스토리지 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // uploads 폴더가 없으면 생성
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 파일 이름: 현재 시간_원래 파일 이름 (중복 방지)
        const ext = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, ext);
        cb(null, `${fileName}_${Date.now()}${ext}`);
    },
});

// 파일 필터 설정 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    // MIME 타입 검사
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // 허용
    } else {
        // 허용되지 않는 파일 형식의 경우 에러 반환
        cb(new ApiError(BAD_REQUEST, '이미지 파일(JPEG, PNG, GIF)만 업로드할 수 있습니다.'), false);
    }
};

// Multer 인스턴스 초기화
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB로 파일 크기 제한
    },
});
