import express from 'express';
import cors from 'cors';  // 新增
import 'dotenv/config';
import TaskRouter from './routes/TaskRouter.js';
import AuthRouter from './routes/AuthRouter.js';
import ResultRouter from './routes/ResultRouter.js';


import { initializeDatabase } from './database/init_db.js'; // 导入初始化函数
const app = express();

// 初始化数据库
initializeDatabase();

const corsOptions = {
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200,
    origin: 'http://localhost:5175',
    credentials: true, // 允许携带凭据
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', TaskRouter);
app.use('/api', AuthRouter);
app.use('/api', ResultRouter);

const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});