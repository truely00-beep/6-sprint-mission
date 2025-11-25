

export function UploadSingleImage(req, res, next) {
    try {
        const { filename } = req.file;
        const path = `files/${filename}`;
        res.json({ path });
    }
    catch { next(); }
}