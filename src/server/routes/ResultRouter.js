import express from 'express';
import { authenticate } from './authMiddleware.js';
import dbManager from '../database/db_manager.js';
import { uploadFile } from "./UploadResult.js"
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

const router = express.Router();


// 上传分析结果的
router.post('/upload_results', uploadFile.array('files'), async (req, res) => {
  try {
    const files = req.files; // 获取上传的文件
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'noFile' });
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

// 更新任务是由分析主机执行的，参数为: 
// {uuid: "xxxx", status: "Done", complete_at: current_time, result_files: JSON.stringify({name: "xxxx", size: "xxxMB"})}
router.post('/update_task', async (req, res) => {
  try {
    const tasks = await dbManager.selectAll("tasks", { uuid: req.body.uuid })
    if (tasks.length == 0) {
      return res.status(401).json({ message: 'InvalidRecord' });
    }
    const task = tasks[0]
    await dbManager.update("tasks", req.body, { id: task.id })
    res.status(201).json({ success: true, uuid: req.body.uuid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 前端读取后端的结果文件
router.get('/result_file', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { uuid, dirName, fileName, fileId } = req.query;
    const rootDir = process.cwd();
    const resultsPath = path.join(rootDir, 'filesData', user.name, uuid, 'results');

    // 确保 results 目录存在
    if (!fs.existsSync(resultsPath)) {
      fs.mkdirSync(resultsPath, { recursive: true });
    }

    // 构建 dirName 文件夹路径
    const dirNameFolderPath = path.join(resultsPath, dirName);

    // 构建 dirName.zip 文件路径
    const dirNameZipPath = path.join(resultsPath, `${dirName}.zip`);

    let targetFolderPath = dirNameFolderPath;

    // 检查 dirName 文件夹是否存在
    if (!fs.existsSync(dirNameFolderPath)) {
      // 如果文件夹不存在，检查是否存在对应的 ZIP 文件
      if (fs.existsSync(dirNameZipPath)) {
        // 如果 ZIP 文件存在，解压它
        const zip = new AdmZip(dirNameZipPath);
        zip.extractAllTo(resultsPath, true); // 解压到 results 目录

        // 更新目标文件夹路径
        targetFolderPath = dirNameFolderPath;
      } else {
        // 如果 ZIP 文件也不存在，返回错误
        return res.status(404).json({ success: false, message: 'noFile' });
      }
    }

    // 如果 fileId 存在，进一步定位到子文件夹
    if (fileId) {
      targetFolderPath = path.join(targetFolderPath, fileId);
      if (!fs.existsSync(targetFolderPath)) {
        return res.status(404).json({ success: false, message: 'noFile' });
      }
    }

    // 读取目标文件夹内容
    const files = fs.readdirSync(targetFolderPath);

    // 查找文件名包含 fileName 的文件
    const targetFile = files.find((file) => file.includes(fileName));
    if (!targetFile) {
      return res.status(404).json({ success: false, message: 'noFile' });
    }

    // 读取文件内容
    const targetFilePath = path.join(targetFolderPath, targetFile);
    const targetFileContent = fs.readFileSync(targetFilePath, 'utf8');

    // 返回文件内容
    return res.status(200).json({ success: true, data: targetFileContent });
  } catch (error) {
    console.error('获取文件失败：', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/graphml_files', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { uuid, dirName } = req.query;
    const rootDir = process.cwd();
    const resultsPath = path.join(rootDir, 'filesData', user.name, uuid, 'results');

    // 确保 results 目录存在
    if (!fs.existsSync(resultsPath)) {
      return res.status(404).json({ success: false, message: 'noFile' });
    }

    // 构建 dirName 文件夹路径
    const dirNameFolderPath = path.join(resultsPath, dirName);

    // 构建 dirName.zip 文件路径
    const dirNameZipPath = path.join(resultsPath, `${dirName}.zip`);

    let targetFolderPath = dirNameFolderPath;

    // 检查 dirName 文件夹是否存在
    if (!fs.existsSync(dirNameFolderPath)) {
      // 如果文件夹不存在，检查是否存在对应的 ZIP 文件
      if (fs.existsSync(dirNameZipPath)) {
        // 如果 ZIP 文件存在，解压它
        const zip = new AdmZip(dirNameZipPath);
        zip.extractAllTo(resultsPath, true); // 解压到 results 目录

        // 更新目标文件夹路径
        targetFolderPath = dirNameFolderPath;
      } else {
        // 如果 ZIP 文件也不存在，返回错误
        return res.status(404).json({ success: false, message: 'noFile' });
      }
    }

    // 读取目标文件夹内容
    const files = fs.readdirSync(targetFolderPath);

    // 过滤出后缀为 .graphml 的文件
    const graphmlFiles = files.filter((file) => path.extname(file).toLowerCase() === '.graphml');

    // 返回 .graphml 文件名列表
    return res.status(200).json({ success: true, data: graphmlFiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/download_result', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { uuid, dirName } = req.query;
    const rootDir = process.cwd();
    const resultsPath = path.join(rootDir, 'filesData', user.name, uuid, 'results');

    // 构建 dirName.zip 文件路径
    const dirNameZipPath = path.join(resultsPath, `${dirName}.zip`);

    // 检查 ZIP 文件是否存在
    if (!fs.existsSync(dirNameZipPath)) {
      return res.status(404).json({ success: false, message: 'noFile' });
    }

    // 设置响应头，告诉浏览器这是一个文件下载
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${dirName}.zip`);

    // 创建可读流并管道到响应对象
    const fileStream = fs.createReadStream(dirNameZipPath);
    fileStream.pipe(res);

    // 处理流错误
    fileStream.on('error', (error) => {
      console.error('文件流错误：', error);
      res.status(500).json({ success: false, message: '文件流错误' });
    });
  } catch (error) {
    console.error('下载 ZIP 文件失败：', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;