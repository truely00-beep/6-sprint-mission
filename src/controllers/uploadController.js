import path from 'path';
import fs from 'fs';

export const uploadFileController = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '업로드할 파일이 없습니다.' });
    }

    // 파일 저장 경로
    const fileUrl = `/uploads/${req.file.filename}`;

    // 결과 반환
    res.status(200).json({
      message: '파일 업로드 성공!',
      fileName: req.file.originalname,
      fileUrl,
    });
  } catch (error) {
    next(error);
  }
};
