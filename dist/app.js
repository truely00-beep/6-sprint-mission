"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = require("./lib/constants");
const productRouter_js_1 = __importDefault(require("./router/productRouter.js"));
const articleRouter_js_1 = __importDefault(require("./router/articleRouter.js"));
const errorHandler_js_1 = require("./handler/errorHandler.js");
const commentRouter_js_1 = __importDefault(require("./router/commentRouter.js"));
const uploadRouter_js_1 = __importDefault(require("./router/uploadRouter.js"));
const userRouter_js_1 = __importDefault(require("./router/userRouter.js"));
const authRouter_js_1 = __importDefault(require("./router/authRouter.js"));
const app = (0, express_1.default)();
// app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, this is the API server.');
});
//product
app.use('/products', productRouter_js_1.default);
//article
app.use('/articles', articleRouter_js_1.default);
//comment
app.use('/comments', commentRouter_js_1.default);
//image
app.use('/files', express_1.default.static('uploads'));
app.use('/files', uploadRouter_js_1.default);
//auth
app.use('/auth', authRouter_js_1.default);
//user
app.use('/user', userRouter_js_1.default);
app.use(errorHandler_js_1.defaultNotFoundHandler);
app.use(errorHandler_js_1.errorHandler);
app.listen(constants_1.PORT || 3000, () => console.log('Server started'));
