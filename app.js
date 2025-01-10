const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { fetchDataFromAPI } = require('./api/update');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});

let referendas = [];
let startId = 0;

async function refreshReferendas() {
    const result = await fetchDataFromAPI(0);
    if (result.length > 0) referendas = result;     // TODO append or overwrite?
}

setInterval(refreshReferendas, process.env.REFRESH_INTERVAL);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
