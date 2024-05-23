const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Register the log task
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    },
  },
  pageLoadTimeout: 60000, // Increase timeout to 60 seconds
  defaultCommandTimeout: 10000,
  video: true,
  videoCompression: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true
  }
});

