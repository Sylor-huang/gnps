import express from 'express';
import { authenticate } from './authMiddleware.js';
import dbManager from '../database/db_manager.js';
import { uploadFile } from "./UploadFile.js"
import { updateConfigTimes} from "../models/tasks/updateConfigs.js"
import path from 'path';
import fs from 'fs';


const router = express.Router();

router.get('/tasks', authenticate, async (req, res) => {
  try {
    const user = req.user
    let conditions = req.query.conditions || {}
    conditions.user_id = user.id
    const tasks = await dbManager.selectWithPagination("tasks", conditions, req.query.options)
    res.status(201).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 必须有一个 uuid
router.post('/upload_files', authenticate, uploadFile.array('files'), async (req, res) => {
  try {
    const files = req.files; // 获取上传的文件
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'emptyFiles' });
    }

    const fileDetails = files.map((file) => {
      const filePath = file.path; // 服务器文件系统路径
      return {
        filename: file.filename, // 文件名
        path: filePath, // 服务器文件系统路径
        size: file.size, // 文件大小
      };
    });
    res.status(201).json({ success: true, files: fileDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// uuid 为前端传入
router.post('/create_task', authenticate, async (req, res) => {
  try {
    const user = req.user
    const params = req.body
    params.status = 'Process'
    params.user_id = user.id
    await dbManager.insert("tasks", params)
    await updateConfigTimes("usage_times")
    res.status(201).json({ success: true, uuid: req.body.uuid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/delete_task', authenticate, async (req, res) => {
  try {
    const user = req.user
    const rootDir = process.cwd();

    const folderPath = path.join(rootDir,'filesData', user.name, req.body.uuid); // 构建上传路径
    if (fs.existsSync(folderPath)) {
      // 使用 fs.rm 删除整个文件夹
      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    await dbManager.delete("tasks", { user_id: user.id, uuid: req.body.uuid })

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/update_times', async (req, res) => {
  try {
    await updateConfigTimes("view_times")
    const data = await dbManager.selectByNames("configs", ["view_times", "usage_times"])
    res.status(201).json({ success: true, data: data});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



export default router;