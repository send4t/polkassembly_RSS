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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
