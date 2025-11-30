import express from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import productRouter from './routes/productRouter.js'
import articleRouter from './routes/articleRouter.js'
import commentRouter from './routes/commentRouter.js'


const app = express()

app.use(express.json())


app.use('/products', productRouter)
app.use('/articles', articleRouter)
app.use('/comments', commentRouter)



app.use(errorHandler)
app.listen(3000, () => console.log("Server Start"))

