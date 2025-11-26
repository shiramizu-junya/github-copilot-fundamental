const users = [];

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

const createUser = (name, email) => {
    const id = users.length + 1;
    const newUser = new User(id, name, email);
    users.push(newUser);
    return newUser;
};

const getUser = (id) => {
    return users.find(user => user.id === id);
};

const updateUser = (id, name, email) => {
    const user = getUser(id);
    if (user) {
        user.name = name;
        user.email = email;
        return user;
    }
    return null;
};

const deleteUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return null;
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};