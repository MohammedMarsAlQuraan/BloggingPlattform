"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs = require('fs');
class Logger {
    static log(pErrorMessage) {
        try {
            const tTimestamp = new Date().toISOString();
            const tLogMessage = `${tTimestamp}: ${pErrorMessage}\n`;
            fs.appendFile('error.log', tLogMessage, (err) => {
                if (err) {
                    console.error('Failed to log error:', err);
                }
            });
        }
        catch (error) {
            console.error('Failed to log error:', error);
        }
    }
}
exports.Logger = Logger;
