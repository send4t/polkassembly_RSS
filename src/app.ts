import express, { Request, Response } from 'express'
import bodyParser from 'body-parser';
const dotenv = require('dotenv');
import { fetchDataFromAPI, handleReferenda, findNotionPageByPostId } from './api/update';
import { fetchDotToUsdRate } from './api/rss';
import { createReferenda } from './api/create';
import { getDatabaseSchema } from './schema';

dotenv.config();
if (!process.env.REFRESH_INTERVAL) throw "Please specify REFRESH_INTERVAL in .env!";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello, world! The app is running.');
});

let startId = 1200;

async function refreshReferendas() {
    const schema = await getDatabaseSchema();
    const create = createReferenda(process.env.NOTION_DATABASE_ID as any, "Hello from createReferenda!", 500)
    return;    
    const referendas = await fetchDataFromAPI(startId, 1, 15);
    console.log(referendas);return;
    const page = await findNotionPageByPostId(1400);
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
