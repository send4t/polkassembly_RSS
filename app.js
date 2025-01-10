const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});

// Example POST route
app.post('/example-delete-later', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    res.status(200).send('Data received successfully.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
