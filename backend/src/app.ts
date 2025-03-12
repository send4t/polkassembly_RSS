import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const dotenv = require('dotenv');
dotenv.config();
if (!process.env.REFRESH_INTERVAL) throw "Please specify REFRESH_INTERVAL in .env!";
import { refreshReferendas } from './refresh';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello, world! The app is running.');
});


refreshReferendas();
setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
