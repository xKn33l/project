const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Starting a db connection 
const db = new sqlite3.Database('../touristsync.db');

// Now we register a new user 
exports.registerUser = (name, email, password, callback) => {
    // Hashing for security
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function (err) {
                if (err) return callback(err);
                callback(null, {id: this.lastID, name, email});
            }
        );
    });
};

// We try authentication now 
exports.authenticateUser = (email, password, callback) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return callback(err);
        if (!row) return callback(null, null); // User not found

        // We compare passwords 
        bcrypt.compare(password, row.password, (err, isMatch) => {
            if (err) return callback(err);
            if (!isMatch) return callback(null, null); // Invalid password
            callback(null, row); //Login success
        });
    });
};