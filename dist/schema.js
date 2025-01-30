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
exports.getDatabaseSchema = getDatabaseSchema;
const fs_1 = __importDefault(require("fs"));
const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
function getDatabaseSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${notionApiToken}`,
                'Notion-Version': '2021-05-13', // Make sure to use the correct API version
            },
        });
        const data = yield response.json();
        fs_1.default.writeFileSync('schema.txt', JSON.stringify(data));
        console.log(data);
    });
}
