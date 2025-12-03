import { PORT, EXPRESS } from './libs/constants.js';
import cors from 'cors';
import { RouterManager } from './Routers/routerManager.js';
import { getCorsOrigin, corsOriginChecker } from './libs/corsSetUp.js';
import errorHandler from './libs/Handler/errorHandler.js';

const app = EXPRESS();


app.use(cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(EXPRESS.json());
app.use(EXPRESS.urlencoded({ extended: true }));

app.use('/upload', EXPRESS.static('upload'));



app.use('/', RouterManager);



app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running`);
});