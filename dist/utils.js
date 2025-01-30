"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedOrigin = getValidatedOrigin;
exports.getValidatedStatus = getValidatedStatus;
const properties_1 = require("./types/properties");
function getValidatedOrigin(origin) {
    if (!origin)
        return properties_1.Origin.NoOriginInformationAvailable;
    if (Object.values(properties_1.Origin).includes(origin)) {
        return origin;
    }
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}
function getValidatedStatus(status) {
    if (!status)
        throw new Error("No VoteStatus found"); // probably return some default value, but this way we are not saying incorrect things
    if (Object.values(properties_1.TimelineStatus).includes(status)) {
        return status;
    }
    throw new Error(`Invalid vote status: ${status}`);
}
