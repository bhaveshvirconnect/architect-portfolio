const pool = require('../config/db');

exports.submitContact = async (req, res) => {

    const {
        name,
        email,
        project_type,
        message
    } = req.body;

    try {

        if (!name || !email || !message) {
            return res.status(400).json({
                message: 'Name, email and message are required'
            });
        }

        const result = await pool.query(
            `
            INSERT INTO contact_messages
            (
                name,
                email,
                project_type,
                message
            )
            VALUES
            ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                name,
                email,
                project_type || null,
                message
            ]
        );

        res.status(201).json({
            message: 'Thank you! Your message has been received.',
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.getMessages = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM contact_messages
            ORDER BY created_at DESC
            `
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};