import express from 'express';
import multer from 'multer';

const uploadRouter = express.Router();

const app = express();
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

uploadRouter.route('/').post(upload.single('attachment'), (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
  const path = `/files/${filename}`;
  res.json({ path });
});

export default uploadRouter;
