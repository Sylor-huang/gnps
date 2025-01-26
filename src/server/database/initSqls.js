export function usersSql(dbManager) {
  dbManager.createTable('users', [
    { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
    { name: 'email', type: 'VARCHAR(255) NOT NULL' },
    { name: 'password', type: 'VARCHAR(255) NOT NULL' },
    { name: 'name', type: 'VARCHAR(255)' },
    { name: 'company', type: 'VARCHAR(255)' },
    { name: 'is_admin', type: "VARCHAR(255) DEFAULT '0'" },
    { name: 'updated_at', type: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  ], [
    { columns: ['email'], unique: true },
    { columns: ['email', 'name'], unique: true },
  ]);
}

export function emailCodesSql(dbManager) {
  dbManager.createTable('email_codes', [
    { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
    { name: 'email', type: 'VARCHAR(255) NOT NULL' },
    { name: 'code', type: 'VARCHAR(255) NOT NULL' },
    { name: 'uuid', type: 'VARCHAR(255)' },
    { name: 'updated_at', type: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  ], [
    { columns: ['email']},
    { columns: ['email', 'uuid'], unique: true }
  ]);
}

export async function tasksSql(dbManager) {
  dbManager.createTable('tasks', [
    { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
    { name: 'user_id', type: 'INTEGER NOT NULL' },
    { name: 'uuid', type: 'VARCHAR(255) NOT NULL' },
    { name: 'workflow', type: 'VARCHAR(255)' },
    { name: 'status', type: "VARCHAR(255) DEFAULT 'Process'" },
    { name: 'params', type: 'VARCHAR(255)' },
    { name: 'complete_at', type: 'TIMESTAMP' },
    { name: 'result_files', type: 'VARCHAR(255)' },
    { name: 'updated_at', type: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  ], [
    { columns: ['user_id']},
    { columns: ['uuid'], unique: true},
    { columns: ['user_id', 'uuid'], unique: true},
    { columns: ['user_id', 'status']},
    { columns: ['user_id', 'workflow']}
  ]);
}