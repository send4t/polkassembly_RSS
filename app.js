const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { fetchDataFromAPI, handleReferenda } = require('./api/update');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});

let startId = 1200;

async function refreshReferendas() {
    const referendas = await fetchDataFromAPI(startId);

    for (let i = 0; i < referendas.length; i++) {
        console.log("Referenda: ", referendas[i]);
        await handleReferenda(referendas[i]);
    }
}

refreshReferendas();
setInterval(refreshReferendas, process.env.REFRESH_INTERVAL * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
