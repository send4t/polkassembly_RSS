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
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = require('dotenv');
const update_1 = require("./api/update");
const rss_1 = require("./api/rss");
const create_1 = require("./api/create");
const properties_1 = require("./types/properties");
dotenv.config();
if (!process.env.REFRESH_INTERVAL)
    throw "Please specify REFRESH_INTERVAL in .env!";
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, world! The app is running.');
});
let startId = 1200;
function refreshReferendas() {
    return __awaiter(this, void 0, void 0, function* () {
        const referendas = yield (0, update_1.fetchDataFromAPI)(startId, 1, 15);
        console.log("Referendas from Polkassembly: ", referendas[0]);
        const create = (0, create_1.createReferenda)(process.env.NOTION_DATABASE_ID, referendas[0], properties_1.Chain.Polkadot);
        return;
        const page = yield (0, update_1.findNotionPageByPostId)(1400);
        console.log("Referendas: ", referendas);
        console.log("referenda count: ", referendas.length);
        const dotToUsdRate = yield (0, rss_1.fetchDotToUsdRate)();
        for (let i = 0; i < referendas.length; i++) {
            //console.log("Referenda: ", referendas[i]);
            yield (0, update_1.handleReferenda)(referendas[i], dotToUsdRate);
        }
    });
}
refreshReferendas();
setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenGov Voting tool is runing, port: ${PORT}`);
});
