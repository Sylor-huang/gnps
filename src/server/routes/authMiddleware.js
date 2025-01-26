import { decodeUserInfo } from '../models/users/auth.js';
import dbManager from '../database/db_manager.js';

export const authenticate = async (req, res, next) => {
  const encodedUserInfo = req.header('Authorization')?.replace('Bearer ', '');
  if (!encodedUserInfo) {
    return res.status(401).json({ message: 'InvalidToken' });
  }

  try {
    const userId = decodeUserInfo(encodedUserInfo);
    const existingUser = await dbManager.selectAll("users", { id: userId })

    if (existingUser.length == 0) {
      return res.status(401).json({ message: 'InvalidToken' });
    }
    req.user = existingUser[0];
    next();
  } catch (error) {
    res.status(400).json({ message: 'InvalidToken' });
  }
};