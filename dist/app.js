"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { fetchDataFromAPI, handleReferenda, createReferenda, findNotionPageByPostId } = require('./api/update');
const { fetchDotToUsdRate } = require('./api/rss');
dotenv.config();
if (!process.env.REFRESH_INTERVAL)
    throw "Please specify REFRESH_INTERVAL in .env!";
const app = (0, express_1.default)();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});
let startId = 1200;
function refreshReferendas() {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield findNotionPageByPostId(1400);
        console.log("PAGE ", page);
        console.log(page.archived);
        console.log(page.cover);
        console.log(page.properties);
        return;
        const create = createReferenda(process.env.NOTION_DATABASE_ID, "Hello World", "$500");
        const referendas = yield fetchDataFromAPI(startId, 1, 15);
        console.log("Referendas: ", referendas);
        console.log("referenda count: ", referendas.length);
        const dotToUsdRate = yield fetchDotToUsdRate();
        for (let i = 0; i < referendas.length; i++) {
            //console.log("Referenda: ", referendas[i]);
            yield handleReferenda(referendas[i], dotToUsdRate);
        }
    });
}
refreshReferendas();
setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
