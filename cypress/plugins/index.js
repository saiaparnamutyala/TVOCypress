const { merge } = require('mochawesome-merge');
const generate = require('mochawesome-report-generator');

module.exports = (on, config) => {
    on('after:run', async (results) => {
        if (results) {
            const jsonReport = await merge({
                files: ['./cypress/reports/*.json']
            });
            await generate.create(jsonReport, {
                reportDir: './cypress/reports',
                inline: true,
            });
            console.log('Report generated');
        }
    });

    on('task', {
        log(message) {
            console.log(message);
            return null;
        }
    });
    require('cypress-mochawesome-reporter/plugin')(on);
};


