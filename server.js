const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const apiService = require('./service.js');

// Load env
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start API Service
const service = new apiService({ Username: process.env.sa_username, Password: process.env.sa_password });

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/case-groups', async (req, res) => {
    try {
        const data = await service.getCaseGroups();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/create-case', async (req, res) => {
    try {
        const data = await service.createCase(req.body.data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});