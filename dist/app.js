"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = require("./lib/constants");
const productRouter_1 = __importDefault(require("./router/productRouter"));
const articleRouter_1 = __importDefault(require("./router/articleRouter"));
const errorHandler_1 = require("./handler/errorHandler");
const commentRouter_1 = __importDefault(require("./router/commentRouter"));
const uploadRouter_1 = __importDefault(require("./router/uploadRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const app = (0, express_1.default)();
// app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, this is the API server.');
});
//product
app.use('/products', productRouter_1.default);
//article
app.use('/articles', articleRouter_1.default);
//comment
app.use('/comments', commentRouter_1.default);
//image
app.use('/files', express_1.default.static('uploads'));
app.use('/files', uploadRouter_1.default);
//auth
app.use('/auth', authRouter_1.default);
//user
app.use('/user', userRouter_1.default);
app.use(errorHandler_1.defaultNotFoundHandler);
app.use(errorHandler_1.errorHandler);
app.listen(constants_1.PORT || 3000, () => console.log('Server started'));
