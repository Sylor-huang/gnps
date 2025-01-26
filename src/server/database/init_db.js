import dbManager from './db_manager.js';

import { usersSql,emailCodesSql, tasksSql,configsSql,customDatabaseSql } from './initSqls.js';
// 初始化所有表
export function initializeDatabase() {
  usersSql(dbManager);
  emailCodesSql(dbManager);
  tasksSql(dbManager);
  configsSql(dbManager);
  customDatabaseSql(dbManager)
}