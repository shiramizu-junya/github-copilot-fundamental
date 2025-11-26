class UserController {
	currentId = 1;
	users = [];

	constructor() {
		this.users = []; // In-memory user storage
		this.currentId = 1; // Simple ID management
	}

	createUser = (req, res) => {
		const { name, email } = req.body;
		const newUser = { id: this.currentId++, name, email };
		this.users.push(newUser);
		res.status(201).json(newUser);
	};

	getUser = (req, res) => {
		const userId = parseInt(req.params.id);
		const user = this.users.find((u) => u.id === userId);
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};

	updateUser = (req, res) => {
		const userId = parseInt(req.params.id);
		const userIndex = this.users.findIndex((u) => u.id === userId);
		if (userIndex !== -1) {
			const { name, email } = req.body;
			this.users[userIndex] = { id: userId, name, email };
			res.json(this.users[userIndex]);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};

	deleteUser = (req, res) => {
		const userId = parseInt(req.params.id);
		const userIndex = this.users.findIndex((u) => u.id === userId);
		if (userIndex !== -1) {
			this.users.splice(userIndex, 1);
			res.status(204).send();
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};
}

module.exports = new UserController();
