import ApiError from '../utils/apiError.js';

/**
 * [POST /api/upload/image]
 * 이미지 업로드 처리
 * multer 미들웨어에 의해 파일은 이미 서버에 저장됨.
 * 이 컨트롤러는 저장된 파일의 정보를 클라이언트에게 반환합니다.
 */
export const uploadImage = async (req, res) => {
  // multer가 파일을 성공적으로 처리하면 req.file 객체에 파일 정보가 담깁니다.
  if (!req.file) {
    // 파일이 없거나 업로드 중 오류가 발생한 경우를 대비하여 검사합니다.
    throw ApiError.badRequest('이미지 파일 업로드에 실패했거나, 파일을 찾을 수 없습니다.');
  }

  // 성공적으로 업로드된 파일 정보 반환
  // 실제 운영 환경에서는 filePath 대신 서버의 정적 파일 접근 URL을 제공해야 합니다.
  const fileInfo = {
    fileName: req.file.filename,
    filePath: req.file.path, // 서버에 저장된 로컬 경로 (예: 'uploads/abc-123.png')
    mimeType: req.file.mimetype,
    size: req.file.size,
  };

  // 201 Created 상태 코드
  res.status(201).json({
    message: '이미지가 성공적으로 업로드되었습니다.',
    file: fileInfo,
  });
};
