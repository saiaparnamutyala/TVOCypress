describe('Grade 1 Mathematics Page Functionality', () => {

    const baseUrl = 'https://tvolearn.com';

    beforeEach(() => {

        // Set viewport to desktop size
        cy.viewport(1280, 720);

        cy.logActivity('Start test /pages/grade-1-mathematics');

        // Visit the page containing the tabs
        cy.visit(baseUrl + '/pages/grade-1-mathematics');


        // Ignore uncaught exceptions from the application
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        // Set default command timeout
        Cypress.config('defaultCommandTimeout', 20000);
        Cypress.config('pageLoadTimeout', 200000); // Increase page load timeout to 60 seconds  
    });

    afterEach(() => {
        // Capture screenshot after each test
        // cy.screenshot();

        const currentTest = Cypress.mocha.getRunner().test;
        cy.logActivity(`Finished test: ${currentTest.title}`);

    });

    const tabs = [
        { id: '#tab0', title: 'Number' },
        { id: '#tab1', title: 'Algebra' },
        { id: '#tab2', title: 'Data' },
        { id: '#tab3', title: 'Spatial Sense' },
        { id: '#tab4', title: 'Financial Literacy' }
    ];

    tabs.forEach((tab) => {
        it(`should display the ${tab.title} tab and check its links`, () => {
            cy.get(`${tab.id} .tabb`).click();
            cy.get(`${tab.id}`).should('be.visible');
            cy.get(`${tab.id} .tabla a`).each(($link, index) => {
                // Click the link, take a screenshot, and navigate back
                cy.wrap($link).then(($a) => {
                    const href = $a.attr('href');
                    const fullUrl = `${baseUrl}${href}`;

                    cy.logActivity(`Visiting: ${fullUrl}`);
                    // cy.logToFile(`Visiting: ${fullUrl}`);
                    //  cy.visit(fullUrl);

                    // Make a request to the page URL
                    cy.request({
                        url: fullUrl,
                        failOnStatusCode: false // Prevent Cypress from failing the test on 404
                    }).then((response) => {
                        // Check the status code
                        if (response.status === 404) {
                            cy.logActivity('Error: Page returned a 404 status');
                            //cy.logToFile('Error: Page returned a 404 status');
                            // Optionally, you can fail the test if 404 is found
                            throw new Error('Page returned a 404 status');
                        } else {
                            // Visit the page if the status is not 404
                            cy.visit(fullUrl).then(() => {
                                // Capture and log the page title
                                cy.title().then((title) => {
                                    cy.logActivity(`Page Title: ${title}`);
                                    // cy.logToFile('Page Title:', title);
                                    // cy.screenshot(`${tab.title}-link-${index + 1}`);
                                });
                            });
                        }
                    });

                    cy.go('back');
                    cy.get(`${tab.id} .tabb`).click();
                });
            });
        });
    });

    it('should scroll to the Resources for Learning section, check each link, and take screenshots', () => {
        // Scroll to the 'Resources for Learning' section
        cy.get('.shg-c.head-fancy.shg-align-center .shogun-heading-component h2')
            .first()
            .scrollIntoView()
            .should('be.visible')
            .and('contain.text', 'Resources for Learning');

        // Verify the resource list items
        cy.get('.resource_list li').should('have.length.at.least', 1);

        // Iterate through each resource item and check the details
        cy.get('.resource_list li').each((resource, index) => {
            cy.wrap(resource).find('a').then(($a) => {
                const href = $a.attr('href');

                // Make a request to the page URL
                cy.request({
                    url: href,
                    failOnStatusCode: false // Prevent Cypress from failing the test on 404
                }).then((response) => {
                    // Check the status code
                    if (response.status === 404) {
                        cy.logActivity(`Error: Resource link returned a 404 status - ${href}`);
                    } else {
                        // Visit the page if the status is not 404
                        cy.visit(href).then(() => {
                            // Capture and log the page title
                            cy.title().then((title) => {
                                cy.logActivity(`Resource Page Title: ${title}`);
                                cy.screenshot(`resource-link-${index + 1}`);
                            });
                        });
                    }
                });
            });
        });
    });

});


Cypress.Commands.add('logActivity', (message) => {
    cy.task('log', message);
});