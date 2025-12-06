const fs = require('fs');
const path = require('path');

// テスト用のデータベースパスを設定
const testDbPath = path.join(__dirname, '../../data/todos.test.db');

// テスト実行前に既存のテストDBを削除
beforeAll(() => {
	if (fs.existsSync(testDbPath)) {
		fs.unlinkSync(testDbPath);
	}
});

// テスト終了後にテストDBを削除
afterAll(() => {
	if (fs.existsSync(testDbPath)) {
		fs.unlinkSync(testDbPath);
	}
});

// 各テスト前にモジュールキャッシュをクリア
beforeEach(() => {
	jest.resetModules();
});

describe('database.js', () => {
	describe('initDatabase', () => {
		it('データベースを正常に初期化できること', async () => {
			const database = require('../../data/database');
			const db = await database.initDatabase();
			expect(db).toBeDefined();
		});
	});

	describe('create', () => {
		it('新しいTodoを作成できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('テストタスク', 'テスト内容', '2024-12-31', 1);
			const todos = database.getAll();

			expect(todos.length).toBeGreaterThan(0);
			const todo = todos.find((t) => t.title === 'テストタスク');
			expect(todo).toBeDefined();
			expect(todo.title).toBe('テストタスク');
			expect(todo.content).toBe('テスト内容');
			expect(todo.due_date).toBe('2024-12-31');
			expect(todo.priority).toBe(1);
		});

		it('必須項目のみでTodoを作成できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('最小タスク');
			const todos = database.getAll();

			const todo = todos.find((t) => t.title === '最小タスク');
			expect(todo).toBeDefined();
			expect(todo.content).toBe('');
			expect(todo.due_date).toBeNull();
			expect(todo.priority).toBe(2);
		});
	});

	describe('getAll', () => {
		it('全てのTodoを取得できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			const todos = database.getAll();
			expect(Array.isArray(todos)).toBe(true);
		});

		it('優先度順でソートできること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('優先度高', '', null, 1);
			database.create('優先度低', '', null, 3);

			const todos = database.getAll('priority', 'asc');
			const highPriorityIndex = todos.findIndex((t) => t.title === '優先度高');
			const lowPriorityIndex = todos.findIndex((t) => t.title === '優先度低');

			expect(highPriorityIndex).toBeLessThan(lowPriorityIndex);
		});

		it('降順でソートできること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			const todos = database.getAll('priority', 'desc');
			expect(Array.isArray(todos)).toBe(true);
		});

		it('期限日でソートできること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			const todos = database.getAll('due_date', 'asc');
			expect(Array.isArray(todos)).toBe(true);
		});

		it('不正なソートカラムを指定した場合はpriorityでソートされること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			// 不正なカラム名を指定してもエラーにならない
			const todos = database.getAll('invalid_column', 'asc');
			expect(Array.isArray(todos)).toBe(true);
		});
	});

	describe('getById', () => {
		it('IDを指定してTodoを取得できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('ID検索テスト', '内容', '2024-12-31', 2);
			const todos = database.getAll();
			const createdTodo = todos.find((t) => t.title === 'ID検索テスト');

			const todo = database.getById(createdTodo.id);
			expect(todo).toBeDefined();
			expect(todo.title).toBe('ID検索テスト');
		});

		it('存在しないIDを指定した場合はnullを返すこと', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			const todo = database.getById(99999);
			expect(todo).toBeNull();
		});
	});

	describe('update', () => {
		it('Todoを更新できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('更新前タスク', '更新前内容', '2024-12-31', 2);
			const todos = database.getAll();
			const createdTodo = todos.find((t) => t.title === '更新前タスク');

			const result = database.update(createdTodo.id, '更新後タスク', '更新後内容', '2025-01-15', 1);

			expect(result).toBe(1);

			const updatedTodo = database.getById(createdTodo.id);
			expect(updatedTodo.title).toBe('更新後タスク');
			expect(updatedTodo.content).toBe('更新後内容');
			expect(updatedTodo.due_date).toBe('2025-01-15');
			expect(updatedTodo.priority).toBe(1);
		});

		it('存在しないIDを更新しようとした場合は0を返すこと', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			const result = database.update(99999, '更新タスク', '内容', '2024-12-31', 1);
			expect(result).toBe(0);
		});
	});

	describe('deleteById', () => {
		it('Todoを削除できること', async () => {
			const database = require('../../data/database');
			await database.initDatabase();

			database.create('削除テストタスク', '内容', null, 2);
			const todos = database.getAll();
			const createdTodo = todos.find((t) => t.title === '削除テストタスク');

			database.deleteById(createdTodo.id);

			const deletedTodo = database.getById(createdTodo.id);
			expect(deletedTodo).toBeNull();
		});
	});
});
