

export function UploadSingleImage(req, res) {
    const { filename } = req.file;
    const path = `files/${filename}`;
    res.json({ path });
}