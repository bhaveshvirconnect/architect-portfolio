const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/', (req, res) => {
    res.status(200).send(
        '🚀 Ajay Singh Rathore Portfolio Backend is Running...'
    );
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Start Server
const startServer = async () => {
    try {

        try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database Connected:', result.rows[0]);
} catch (err) {
    console.error('❌ Database Connection Failed:', err.message);
    throw err;
}

        console.log('✅ Database Connection Successful');

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

    } catch (error) {

        console.error(
            '❌ Database Connection Failed:',
            error.message
        );

        process.exit(1);
    }
};

startServer();