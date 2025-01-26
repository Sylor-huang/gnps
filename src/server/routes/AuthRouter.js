import express from 'express';
import { hashPassword, comparePassword, encodeUserInfo } from '../models/users/auth.js';
import dbManager from '../database/db_manager.js';
import { sendMail } from '../models/users/send_email.js';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from './authMiddleware.js';


const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  const option = req.body;

  // 检查用户名是否已存在
  const existingUserName = await dbManager.selectAll("users", {name: option.name})
  if (existingUserName.length > 0) {
    return res.status(401).json({ message: 'userExists' });
  }

  const existingUser = await dbManager.selectAll("users", {email: option.email})
  if (existingUser.length > 0) {
    return res.status(401).json({ message: 'userExists' });
  }

  const codes = await dbManager.selectAll("email_codes", {email: option.email, uuid: option.uuid })

  if((codes.length <= 0) || (codes[0].code != option.verify_code)) {
    return res.status(401).json({ message: 'InvalidCode' });
  }

  // 加密密码并创建用户
  const hashedPassword = hashPassword(option.password);
  await dbManager.insert("users", {
    email: option.email,
    password: hashedPassword,
    company: option?.company,
    name: option?.name
  })
  const users = await dbManager.selectAll("users", {email: option.email}, {columns: "id, email, company, name, is_admin"})
  const user = users[0]
  const encodedUserInfo = encodeUserInfo(user.id.toString());
  res.status(201).json({token: encodedUserInfo, user: user});
});

// 用户登录
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 查找用户
  const userData = await dbManager.selectAll("users", {email: email})
  if (userData.length == 0) {
    return res.status(401).json({ message: 'InvalidUser' });
  }

  // 验证密码
  const isPasswordValid = comparePassword(password, userData[0].password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'InvalidUser' });
  }
  const encodedUserInfo = encodeUserInfo(userData[0].id.toString());
  const users = await dbManager.selectAll("users", {email: email}, {columns: "id, email, company, name, is_admin"})
  res.status(201).json({ token:encodedUserInfo, user: users[0] });
});

router.post('/send_email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const randomCodes = Math.floor(100000 + Math.random() * 900000);
    const sendText = `${text}: ${randomCodes}`
    const html = `<div><p>${sendText}</p></div>`
    await sendMail(to, subject, text, html);
    const uuid = uuidv4();
    await dbManager.insert("email_codes", {
      email: to,
      code: `${randomCodes}`,
      uuid: uuid
    })
    res.status(201).json({ success: true, uuid: uuid});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/user_info',authenticate, async (req, res) => {
  const user = req.user;
  const users = await dbManager.selectAll("users", {id: user.id}, {columns: "id, email, company, name"})
  if (users.length == 0) {
    return res.status(401).json({ message: 'InvalidUser' });
  }
  res.status(201).json({ user: users[0] });
});

// 用户更新
router.post('/update_user',authenticate, async (req, res) => {
  const option = req.body;
  const currentUser = req.user;

  // 检查用户名是否已存在
  const existingUserName = await dbManager.selectAll("users", {name: option.name})
  const nameIds = existingUserName.map(k=> Number(k.id))
  const otherIds = nameIds.filter((k) => {
    return k != Number(option.id)
  })
  if (otherIds.length > 0) {
    return res.status(401).json({ message: 'userExists' });
  }

  const existingUser = await dbManager.selectAll("users", {email: option.email})
  const emailIds = existingUser.map(k=> Number(k.id))
  const otherEmailIds = emailIds.filter((k) => {
    return k != Number(option.id)
  })
  if (otherEmailIds.length > 0) {
    return res.status(401).json({ message: 'userExists' });
  }

  const codes = await dbManager.selectAll("email_codes", {email: option.email, uuid: option.uuid })

  if((codes.length <= 0) || (codes[0].code != option.verify_code)) {
    return res.status(401).json({ message: 'InvalidCode' });
  }

  const updateParams = {
    email: option.email,
    company: option?.company,
    name: option?.name
  }

  // 加密密码并创建用户
  if(option.password && option.password.length > 0) {
    const hashedPassword = hashPassword(option.password);
    updateParams.password = hashedPassword
  }

  await dbManager.update("users", updateParams, {id: currentUser.id})
  const users = await dbManager.selectAll("users", {id: currentUser.id}, {columns: "id, email, company, name, is_admin"})
  const user = users[0]
  const encodedUserInfo = encodeUserInfo(user.id.toString());
  res.status(201).json({token: encodedUserInfo, user: user});
});

// 更新密码
router.post('/update_passwd', async (req, res) => {
  const option = req.body;

  // 检查用户名是否已存在
  const existingUser = await dbManager.selectAll("users", {email: option.email}, {columns: "id, email, company, name, is_admin"})
  if (existingUser.length == 0) {
    return res.status(401).json({ message: 'InvalidUser' });
  }

  const codes = await dbManager.selectAll("email_codes", {email: option.email, uuid: option.uuid })

  if((codes.length <= 0) || (codes[0].code != option.verify_code)) {
    return res.status(401).json({ message: 'InvalidCode' });
  }
  const hashedPassword = hashPassword(option.password);
  const user = existingUser[0]
  await dbManager.update("users", {password: hashedPassword}, {id: user.id})
  res.status(201).json({success: true});
});

export default router;

