import bcrypt from 'bcryptjs';
import 'dotenv/config';
import CryptoJS from 'crypto-js';


// 加密密码
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// 验证密码
export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};


// Base64 编码
export function encodeUserInfo(info) {
  const SECRET_KEY = process.env.TOKEN_CRYPTO_SALT
  return CryptoJS.AES.encrypt(info, SECRET_KEY).toString();
}

// Base64 解码
export function decodeUserInfo(encodedInfo) {
  const SECRET_KEY = process.env.TOKEN_CRYPTO_SALT
  const bytes = CryptoJS.AES.decrypt(encodedInfo, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}