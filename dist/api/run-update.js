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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const { main } = require("./update");
let lastProcessedPostId = null;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }
        try {
            if (req.body.reset) {
                lastProcessedPostId = parseInt(req.body.lastProcessedPostId || 1229, 10);
                console.log(`Starting update process from post ID: ${lastProcessedPostId}`);
            }
            // Process the next batch
            const nextPostId = yield main(lastProcessedPostId);
            lastProcessedPostId = nextPostId;
            res.status(200).json({
                message: `Processed posts up to ID: ${lastProcessedPostId}`,
                nextPostId: lastProcessedPostId,
            });
        }
        catch (error) {
            console.error("Error during update:", error.message);
            res.status(500).json({ error: error.message });
        }
    });
}
