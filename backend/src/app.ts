import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const dotenv = require('dotenv');
dotenv.config();
if (!process.env.REFRESH_INTERVAL) throw "Please specify REFRESH_INTERVAL in .env!";
import { refreshReferendas } from './refresh';
import { sendReadyProposalsToMimir } from './mimir/refreshEndpoint';
import { SUCCESS_PAGE } from './utils/constants';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/send-to-mimir', async (req: Request, res: Response) => {
    try {
        await sendReadyProposalsToMimir();
        res.send(SUCCESS_PAGE);
    } catch (error) {
        res.status(500).send('Error sending referendas to Mimir: ' + (error as any).message);
    }
});


refreshReferendas();
setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
