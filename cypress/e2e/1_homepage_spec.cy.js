describe('TVOLearn Website Functionality', () => {

    const baseUrl = 'https://tvolearn.com';
  
    before(() => {
      // Set default command timeout
      cy.config('defaultCommandTimeout', 10000);
      cy.config('pageLoadTimeout', 60000); // Increase page load timeout to 60 seconds
  
      // Ignore uncaught exceptions from the application
      cy.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    })
  
    beforeEach(() => {
  
      cy.viewport(1280, 720); // Set viewport to desktop size
  
    });
  
    //Function for Learning Resources (K-12) Menu Opening
    const openLearningResourcesMenu = () => {
      cy.logActivity('Open Learning Resources (K-12) Menu');
      // cy.screenshot('before-opening-menu'); // Capture screenshot before opening menu
      cy.get('button[aria-controls="SiteNavLabel-learning-resources-k-12"]', { timeout: 10000 }).then($button => {
        if ($button.is(':visible')) {
          // If the button is visible, it's a mobile view
          cy.get('button.site-nav__link--button', { timeout: 10000 }).click({ multiple: true });
        }
      });
      cy.get('button[aria-controls="SiteNavLabel-learning-resources-k-12"]', { timeout: 10000 }).click({ multiple: true });
      cy.get('div#SiteNavLabel-learning-resources-k-12', { timeout: 10000 }).should('be.visible'); // Wait for dropdown to be visible
      // cy.screenshot('after-opening-menu'); // Capture screenshot after opening menu
    };
  
    it('Home -> Grade-1 -> Grade-1 Math', () => {
  
      cy.logActivity(`Visiting Home Page: ${baseUrl}`);
  
      // Make a request to the page URL
      cy.request({
        url: baseUrl,
        failOnStatusCode: false // Prevent Cypress from failing the test on 404
      }).then((response) => {
        // Check the status code
        if (response.status === 404) {
          cy.logActivity('Error: Page returned a 404 status');
          // Optionally, you can fail the test if 404 is found
          throw new Error('Page returned a 404 status');
        } else {
          // Visit the page if the status is not 404
          cy.visit(baseUrl).then(() => {
            // Capture and log the page title
            cy.title().then((title) => {
              cy.logActivity(`Page Title: ${title}`);
            });
          });
        }
      });
  
      openLearningResourcesMenu();
  
      cy.contains('a', 'Grade 1', { timeout: 10000 }).should('be.visible').click({ multiple: true });
  
      // Check if the page is 404 or opened
      const Grade1PageUrl = '/pages/grade-1';
      cy.url().should('include', Grade1PageUrl).then(url => {
        cy.request({
          url,
          failOnStatusCode: false // Prevent Cypress from failing the test on 404
        }).then((response) => {
          if (response.status === 404) {
            throw new Error('/pages/grade-1: Page returned a 404 status');
          } else {
            // Capture and log the page title
            cy.title().then((title) => {
              cy.logActivity(`Page Title: ${title}`);
            });
          }
        });
      });
  
      cy.wait(5000); // Wait for the page to load completely
  
      cy.get('.shg-box-content .shogun-heading-component h2').contains('Learn Forward in the Curriculum').scrollIntoView({ duration: 2000 }).should('be.visible');
  
      cy.logActivity('Click on Grade-1 Mathematics card');
      cy.get('.button-math', { timeout: 10000 }).should('be.visible').click({ multiple: true });
  
      // Check if the page is 404 or opened
      const Grade1MathPageUrl = '/pages/grade-1-mathematics';
      cy.url().should('include', Grade1MathPageUrl).then(url => {
        cy.request({
          url,
          failOnStatusCode: false // Prevent Cypress from failing the test on 404
        }).then((response) => {
          if (response.status === 404) {
            throw new Error('/pages/grade-1-mathematics: Page returned a 404 status');
          } else {
            // Capture and log the page title
            cy.title().then((title) => {
              cy.logActivity(`Page Title: ${title}`);
            });
          }
        });
      });
  
      cy.wait(5000); // Wait for the page to load completely
      // cy.screenshot('after-clicking-math'); // Capture screenshot after clicking mathematics card
    });
  });
  
  
  Cypress.Commands.add('logActivity', (message) => {
    cy.task('log', message);
  });