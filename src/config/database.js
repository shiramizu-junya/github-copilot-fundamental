const users = [];

const db = {
    getUsers: () => users,
    getUserById: (id) => users.find(user => user.id === id),
    createUser: (user) => {
        users.push(user);
        return user;
    },
    updateUser: (id, updatedUser) => {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            return users[index];
        }
        return null;
    },
    deleteUser: (id) => {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
        return null;
    }
};

module.exports = db;