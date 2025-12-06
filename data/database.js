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
function getAll(sortBy = 'priority', sortOrder = 'asc') {
	// 許可されたソートカラム
	const allowedColumns = ['priority', 'due_date', 'title', 'created_at'];
	const column = allowedColumns.includes(sortBy) ? sortBy : 'priority';
	const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

	// due_dateがnullの場合は最後に表示
	let orderClause;
	if (column === 'due_date') {
		orderClause = `ORDER BY CASE WHEN due_date IS NULL OR due_date = '' THEN 1 ELSE 0 END, due_date ${order}`;
	} else {
		orderClause = `ORDER BY ${column} ${order}`;
	}

	const result = db.exec(`SELECT * FROM todos ${orderClause}`);
	if (result.length === 0) return [];

	const columns = result[0].columns;
	return result[0].values.map((row) => {
		const obj = {};
		columns.forEach((col, i) => (obj[col] = row[i]));
		return obj;
	});
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
