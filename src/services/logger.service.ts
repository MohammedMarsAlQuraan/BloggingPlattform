const fs = require('fs');
export class Logger {
    public static log(pErrorMessage: string) {
        try {
            const tTimestamp = new Date().toISOString();
            const tLogMessage = `${tTimestamp}: ${pErrorMessage}\n`;
            fs.appendFile('error.log', tLogMessage, (err) => {
                if (err) {
                    console.error('Failed to log error:', err);
                }
            });
        } catch (error) {
            console.error('Failed to log error:', error);
        }
    }
}