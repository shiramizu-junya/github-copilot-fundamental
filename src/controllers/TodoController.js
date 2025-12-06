const db = require('../../data/database');

class TodoController {
	// 優先度のラベル
	static PRIORITY_LABELS = {
		1: '高',
		2: '中',
		3: '低',
	};

	// ToDo一覧表示
	index(req, res) {
		try {
			const sortBy = req.query.sort || 'priority';
			const sortOrder = req.query.order || 'asc';
			const todos = db.getAll(sortBy, sortOrder);
			res.render('index', {
				todos,
				priorityLabels: TodoController.PRIORITY_LABELS,
				currentSort: sortBy,
				currentOrder: sortOrder,
			});
		} catch (error) {
			console.error('一覧取得エラー:', error);
			res.status(500).send('エラーが発生しました');
		}
	}

	// 新規作成フォーム表示
	new(req, res) {
		res.render('new', {
			priorityLabels: TodoController.PRIORITY_LABELS,
		});
	}

	// ToDo作成処理
	create(req, res) {
		try {
			const { title, content, due_date, priority } = req.body;

			if (!title || title.trim() === '') {
				return res.status(400).send('タイトルは必須です');
			}

			db.create(title.trim(), content, due_date, priority);

			res.redirect('/');
		} catch (error) {
			console.error('作成エラー:', error);
			res.status(500).send('エラーが発生しました');
		}
	}

	// 編集フォーム表示
	edit(req, res) {
		try {
			const { id } = req.params;
			const todo = db.getById(parseInt(id));

			if (!todo) {
				return res.status(404).send('ToDoが見つかりません');
			}

			res.render('edit', {
				todo,
				priorityLabels: TodoController.PRIORITY_LABELS,
			});
		} catch (error) {
			console.error('編集フォーム表示エラー:', error);
			res.status(500).send('エラーが発生しました');
		}
	}

	// ToDo更新処理
	update(req, res) {
		try {
			const { id } = req.params;
			const { title, content, due_date, priority } = req.body;

			if (!title || title.trim() === '') {
				return res.status(400).send('タイトルは必須です');
			}

			const changes = db.update(parseInt(id), title.trim(), content, due_date, priority);

			if (changes === 0) {
				return res.status(404).send('ToDoが見つかりません');
			}

			res.redirect('/');
		} catch (error) {
			console.error('更新エラー:', error);
			res.status(500).send('エラーが発生しました');
		}
	}

	// ToDo削除処理
	delete(req, res) {
		try {
			const { id } = req.params;
			const todo = db.getById(parseInt(id));

			if (!todo) {
				return res.redirect('/');
			}

			db.deleteById(parseInt(id));
			res.redirect('/');
		} catch (error) {
			console.error('削除エラー:', error);
			res.status(500).send('エラーが発生しました');
		}
	}
}

module.exports = TodoController;
