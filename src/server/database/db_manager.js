import Database from 'better-sqlite3';
import { formatLocalTime } from "./format.js";
import 'dotenv/config';

class DatabaseManager {
  constructor(dbPath) {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // 启用 WAL 模式以提高性能
    DatabaseManager.instance = this;
  }

  // 创建表
  async createTable(tableName, columns, indexes = []) {
    const columnDefinitions = columns
      .map(col => `${col.name} ${col.type} ${col.constraints || ''}`)
      .join(', ');

    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;

    // 创建索引
    indexes.forEach(index => {
      const indexName = `index_${tableName}_on_${index.columns.join('_')}`;
      const uniqueStr = index.unique ? 'UNIQUE' : '';
      sql += `\nCREATE ${uniqueStr} INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${index.columns.join(',')});`;
    });

    this.db.exec(sql);
  }

  // 插入单条数据
  async insert(tableName, data) {
    const dataWithTimestamp = {
      ...data,
      updated_at: formatLocalTime(),
    };

    const columns = Object.keys(dataWithTimestamp);
    const values = Object.values(dataWithTimestamp);
    const placeholders = new Array(columns.length).fill('?').join(',');

    const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;
    const stmt = this.db.prepare(sql);
    return stmt.run(...values);
  }

  // 插入多条数据
  async insertMany(tableName, dataArray) {
    const dataArrayWithTimestamp = dataArray.map(data => ({
      ...data,
      updated_at: formatLocalTime(),
    }));

    const columns = Object.keys(dataArrayWithTimestamp[0]);
    const placeholders = new Array(columns.length).fill('?').join(',');
    const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

    const stmt = this.db.prepare(sql);
    const transaction = this.db.transaction(() => {
      dataArrayWithTimestamp.forEach(item => stmt.run(...Object.values(item)));
    });

    transaction();
  }

  // 根据 ID 查询
  async selectByIds(tableName, ids, options = {}) {
    if (!ids || ids.length === 0) {
      return [];
    }

    const placeholders = ids.map(() => '?').join(',');
    const whereClause = `id IN (${placeholders})`;
    const values = ids.map(id => String(id));

    let sql = `SELECT ${options.columns || '*'} FROM ${tableName} WHERE ${whereClause}`;
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.orderType || 'asc'}`;
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(...values);
  }

  async selectByNames(tableName, names, options = {}) {
    if (!names || names.length === 0) {
      return [];
    }

    const placeholders = names.map(() => '?').join(',');
    const whereClause = `name IN (${placeholders})`;
    const values = names.map(name => String(name));

    let sql = `SELECT ${options.columns || '*'} FROM ${tableName} WHERE ${whereClause}`;
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.orderType || 'asc'}`;
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(...values);
  }

  // 查询所有数据
  async selectAll(tableName, conditions = {}, options = {}) {
    const { whereClause, values } = this._buildWhereClause(conditions);
    let sql = `SELECT ${options.columns || '*'} FROM ${tableName} WHERE ${whereClause}`;
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.orderType || 'asc'}`;
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(...values);
  }

  // 分页查询
  async selectWithPagination(tableName, conditions = {}, options = {}) {
    const { page = 1, pageSize = 10 } = options;
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const { whereClause, values } = this._buildWhereClause(conditions);

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM ${tableName} WHERE ${whereClause}`;
    const totalResult = this.db.prepare(countSql).get(...values);
    const total = totalResult.total;

    // 构建分页查询 SQL
    let sql = `SELECT ${options.columns || '*'} FROM ${tableName} WHERE ${whereClause}`;
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.orderType || 'asc'}`;
    }
    sql += ` LIMIT ? OFFSET ?`;
    values.push(String(pageSize), String(offset));

    // 执行分页查询
    const stmt = this.db.prepare(sql);
    const data = stmt.all(...values);

    return {
      data,
      total,
    };
  }

  // 更新数据
  async update(tableName, data, conditions) {
    const dataWithTimestamp = {
      ...data,
      updated_at: formatLocalTime(),
    };

    const setClause = Object.keys(dataWithTimestamp)
      .map(key => `${key} = ?`)
      .join(',');

    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(dataWithTimestamp), ...Object.values(conditions)];

    const stmt = this.db.prepare(sql);
    return stmt.run(...values);
  }

  // 删除数据
  async delete(tableName, conditions) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const values = Object.values(conditions);

    const stmt = this.db.prepare(sql);
    return stmt.run(...values);
  }

  // 执行自定义 SQL 查询
  async executeQuery(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  // 执行自定义 SQL 语句
  async executeSql(sql) {
    return this.db.exec(sql);
  }

  // 构建 WHERE 子句
  _buildWhereClause(conditions) {
    if (!Object.keys(conditions).length) {
      return { whereClause: '1=1', values: [] };
    }

    const values = [];
    const clauses = Object.entries(conditions)
      .filter(([_, value]) => {
        // 过滤掉空值
        if (value === null || value === undefined || value === '') {
          return false;
        }
        // 如果是对象且包含 like，检查 like 值是否为空
        if (typeof value === 'object' && value !== null && 'like' in value) {
          return value.like !== null && value.like !== undefined && value.like !== '';
        }
        return true;
      })
      .map(([key, value]) => {
        // 检查是否是模糊查询对象
        if (typeof value === 'object' && value !== null && value.like) {
          values.push(`%${String(value.like)}%`);
          return `${key} LIKE ?`;
        }
        // 普通相等查询
        values.push(String(value));
        return `${key} = ?`;
      });

    // 如果没有有效的查询条件，返回默认条件
    if (clauses.length === 0) {
      return { whereClause: '1=1', values: [] };
    }

    return { whereClause: clauses.join(' AND '), values };
  }
}

const dbPath = process.env.DATABASE_PATH || 'database.sqlite';
const dbManager = new DatabaseManager(dbPath);

// 导出单例实例
export default dbManager;