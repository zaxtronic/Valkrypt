class User {
    constructor(id, username, email, passwordHash) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = passwordHash;
        this.createdAt = new Date();
    }

    // Aquí irían métodos para validar password (bcrypt)
    verifyPassword(inputPassword) {
        // Simulación
        return inputPassword === this.password;
    }
}

module.exports = User;