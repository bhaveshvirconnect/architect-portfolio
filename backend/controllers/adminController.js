const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {

    const { username, password } = req.body;

    try {

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM admins
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const admin = result.rows[0];

console.log("Username entered:", username);
console.log("Admin found:", admin);
console.log("Password entered:", password);
console.log("Stored hash:", admin.password);

const isMatch = await bcrypt.compare(
    password,
    admin.password
);

console.log("isMatch:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'JWT_SECRET is not configured'
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};