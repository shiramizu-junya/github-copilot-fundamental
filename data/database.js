const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'todos.db');

let db = null;

// データベース初期化
async function initDatabase() {
	const SQL = await initSqlJs();

	// 既存のデータベースファイルがあれば読み込む
	if (fs.existsSync(dbPath)) {
		const fileBuffer = fs.readFileSync(dbPath);
		db = new SQL.Database(fileBuffer);
	} else {
		db = new SQL.Database();
	}

	// テーブル作成
	db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      due_date TEXT,
      priority INTEGER DEFAULT 2,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

	saveDatabase();
	return db;
}

// データベースをファイルに保存
function saveDatabase() {
	if (db) {
		const data = db.export();
		const buffer = Buffer.from(data);
		fs.writeFileSync(dbPath, buffer);
	}
}

// 全件取得
/**
 * Retrieves all todos from the database with optional sorting.
 *
 * @param {string} [sortBy='priority'] - The column to sort by. Allowed values: 'priority', 'due_date', 'title', 'created_at'.
 * @param {string} [sortOrder='asc'] - The sort order. Accepts 'asc' or 'desc' (case-insensitive).
 * @returns {Array<Object>} An array of todo objects. Returns an empty array if no todos exist.
 *
 * @description
 * - If an invalid sortBy value is provided, defaults to 'priority'.
 * - If an invalid sortOrder is provided, defaults to 'ASC'.
 * - When sorting by 'due_date', null or empty values are placed at the end regardless of sort order.
 */
function getAll(sortBy = 'priority', sortOrder = 'asc') {
	// Validate sortBy column (whitelist approach to prevent SQL injection)
	const allowedColumns = ['priority', 'due_date', 'title', 'created_at'];
	const validSortBy = allowedColumns.includes(sortBy) ? sortBy : 'priority';

	// Validate sortOrder (case-insensitive)
	const normalizedOrder = sortOrder.toLowerCase();
	const validSortOrder = normalizedOrder === 'desc' ? 'DESC' : 'ASC';

	// Build the SQL query with special handling for due_date sorting
	let query;
	if (validSortBy === 'due_date') {
		// For due_date, put null/empty values at the end regardless of sort order
		query = `
			SELECT * FROM todos
			ORDER BY 
				CASE WHEN due_date IS NULL OR due_date = '' THEN 1 ELSE 0 END,
				due_date ${validSortOrder}
		`;
	} else {
		query = `SELECT * FROM todos ORDER BY ${validSortBy} ${validSortOrder}`;
	}

	const stmt = db.prepare(query);
	const results = [];
	const columns = stmt.getColumnNames();

	while (stmt.step()) {
		const values = stmt.get();
		const obj = {};
		columns.forEach((col, i) => (obj[col] = values[i]));
		results.push(obj);
	}

	stmt.free();
	return results;
}

// 1件取得
function getById(id) {
	const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
	stmt.bind([id]);

	if (stmt.step()) {
		const columns = stmt.getColumnNames();
		const values = stmt.get();
		const obj = {};
		columns.forEach((col, i) => (obj[col] = values[i]));
		stmt.free();
		return obj;
	}
	stmt.free();
	return null;
}

// 作成
function create(title, content, due_date, priority) {
	db.run('INSERT INTO todos (title, content, due_date, priority) VALUES (?, ?, ?, ?)', [
		title,
		content || '',
		due_date || null,
		priority || 2,
	]);
	saveDatabase();
}

// 更新
function update(id, title, content, due_date, priority) {
	// 更新前にレコードの存在を確認
	const existing = getById(id);
	if (!existing) {
		return 0;
	}

	db.run(
		'UPDATE todos SET title = ?, content = ?, due_date = ?, priority = ?, updated_at = datetime("now") WHERE id = ?',
		[title, content || '', due_date || null, priority || 2, id]
	);
	saveDatabase();
	return 1;
}

// 削除
function deleteById(id) {
	db.run('DELETE FROM todos WHERE id = ?', [id]);
	saveDatabase();
}

module.exports = {
	initDatabase,
	getAll,
	getById,
	create,
	update,
	deleteById,
};
