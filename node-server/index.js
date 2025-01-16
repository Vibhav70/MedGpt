const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection setup (with Mongoose)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Sample query route to handle queries and use Pinecone RAG API
app.post('/api/query', async (req, res) => {
    try {
        const { question } = req.body;
        const response = await axios.post('http://localhost:8000/query', { question });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing query' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
