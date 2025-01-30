const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { fetchDataFromAPI, handleReferenda, createReferenda, findNotionPageByPostId } = require('./api/update');
const { fetchDotToUsdRate } = require('./api/rss');

dotenv.config();
if (!process.env.REFRESH_INTERVAL) throw "Please specify REFRESH_INTERVAL in .env!";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});

let startId = 1200;

async function refreshReferendas() {
    const page = await findNotionPageByPostId(1400);
    console.log("PAGE ", page)
    const create = createReferenda(process.env.NOTION_DATABASE_ID, "Hello World", "$500")
    return;    
    const referendas = await fetchDataFromAPI(startId, 1, 15);
    console.log("Referendas: ", referendas);
    console.log("referenda count: ", referendas.length);
    const dotToUsdRate = await fetchDotToUsdRate();

    for (let i = 0; i < referendas.length; i++) {
        //console.log("Referenda: ", referendas[i]);
        await handleReferenda(referendas[i], dotToUsdRate);
    }
}

refreshReferendas();
setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
