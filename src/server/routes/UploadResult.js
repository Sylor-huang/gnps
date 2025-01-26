// 后端上传分析结果的

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uuid,user_name } = req.body
    
    if (!uuid) {
      return cb(new Error('UUID is required'), null); // 返回错误
    }
    const rootDir = process.cwd();

    const uploadPath = path.join(rootDir,'filesData', user_name, uuid, "results"); // 构建上传路径
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // 设置文件存储路径
  },
  filename: (req, file, cb) => {
    const filename = file.originalname; // 直接使用原始文件名
    cb(null, filename);
  },
});

export const uploadFile = multer({ storage });
