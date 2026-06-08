const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {

        const username = 'admin';
        const password = 'admin123';

        const existingAdmin = await pool.query(
            `
            SELECT id
            FROM admins
            WHERE username = $1
            `,
            [username]
        );

        if (existingAdmin.rows.length > 0) {
            console.log('⚠️ Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await pool.query(
            `
            INSERT INTO admins
            (
                username,
                password
            )
            VALUES
            ($1, $2)
            `,
            [
                username,
                hashedPassword
            ]
        );

        console.log('✅ Admin Created');
        console.log('Username: admin');
        console.log('Password: admin123');

        process.exit(0);

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
}

createAdmin();