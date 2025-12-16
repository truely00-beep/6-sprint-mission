"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
uploadRouter.post('/', upload.single('attachment'), (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const filename = req.file.filename;
    const path = `/files/${filename}`;
    res.json({ path });
});
exports.default = uploadRouter;
