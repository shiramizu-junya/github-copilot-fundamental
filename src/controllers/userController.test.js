const UserController = require('./userController');

describe('UserController', () => {
	let req, res;

	beforeEach(() => {
		// Reset the controller state before each test
		UserController.users = [];
		UserController.currentId = 1;

		// Mock request and response objects
		req = {
			body: {},
			params: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		};
	});

	describe('createUser', () => {
		it('should create a new user and return 201 status', () => {
			req.body = { name: 'John Doe', email: 'john@example.com' };

			UserController.createUser(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				id: 1,
				name: 'John Doe',
				email: 'john@example.com',
			});
			expect(UserController.users).toHaveLength(1);
		});

		it('should increment user ID for each new user', () => {
			req.body = { name: 'User 1', email: 'user1@example.com' };
			UserController.createUser(req, res);

			req.body = { name: 'User 2', email: 'user2@example.com' };
			UserController.createUser(req, res);

			expect(UserController.users[0].id).toBe(1);
			expect(UserController.users[1].id).toBe(2);
		});
	});

	describe('getUser', () => {
		beforeEach(() => {
			UserController.users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
		});

		it('should return user when found', () => {
			req.params = { id: '1' };

			UserController.getUser(req, res);

			expect(res.json).toHaveBeenCalledWith({
				id: 1,
				name: 'John Doe',
				email: 'john@example.com',
			});
		});

		it('should return 404 when user not found', () => {
			req.params = { id: '999' };

			UserController.getUser(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
		});
	});

	describe('updateUser', () => {
		beforeEach(() => {
			UserController.users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
		});

		it('should update existing user', () => {
			req.params = { id: '1' };
			req.body = { name: 'Jane Doe', email: 'jane@example.com' };

			UserController.updateUser(req, res);

			expect(res.json).toHaveBeenCalledWith({
				id: 1,
				name: 'Jane Doe',
				email: 'jane@example.com',
			});
			expect(UserController.users[0].name).toBe('Jane Doe');
		});

		it('should return 404 when user not found', () => {
			req.params = { id: '999' };
			req.body = { name: 'Jane Doe', email: 'jane@example.com' };

			UserController.updateUser(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
		});
	});

	describe('deleteUser', () => {
		beforeEach(() => {
			UserController.users = [
				{ id: 1, name: 'John Doe', email: 'john@example.com' },
				{ id: 2, name: 'Jane Doe', email: 'jane@example.com' },
			];
		});

		it('should delete existing user and return 204', () => {
			req.params = { id: '1' };

			UserController.deleteUser(req, res);

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.send).toHaveBeenCalled();
			expect(UserController.users).toHaveLength(1);
			expect(UserController.users[0].id).toBe(2);
		});

		it('should return 404 when user not found', () => {
			req.params = { id: '999' };

			UserController.deleteUser(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
		});
	});
});
