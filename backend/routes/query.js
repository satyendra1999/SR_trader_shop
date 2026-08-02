const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Temporary storage
let queries = [];

// POST /api/query
router.post('/query', (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and message are required'
            });
        }

        const newQuery = {
            id: uuidv4(),
            name,
            email,
            phone: phone || 'N/A',
            subject: subject || 'general',
            message,
            createdAt: new Date().toISOString()
        };

        queries.push(newQuery);

        res.status(201).json({
            success: true,
            message: 'Query submitted successfully!',
            data: newQuery
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// GET /api/queries
router.get('/queries', (req, res) => {
    res.json({
        success: true,
        count: queries.length,
        data: queries
    });
});

module.exports = router;