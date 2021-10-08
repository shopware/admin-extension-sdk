/// <reference types="cypress" />

Cypress.Commands.add('getIframe', (iframe = 'iframe') => {
  return cy.get(iframe)
      .its('0.contentDocument.body')
      .should('be.visible')
      .then(cy.wrap);
})

describe('Test the actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8181')
  })

  // Test void actions
  ;[
    {
      type: 'createAlert',
      data: {
        message: "Hello from the iframe!"
      }
    },
    {
      type: 'redirect',
      data: {
        url: "https://www.shopware.com",
        newTab: true
      }
    }
  ].forEach((action) => {
    it(`"${action.type}" action`, () => {
      // set listener
      cy.get('#actionType').type(action.type);
      cy.get('#listenToAction').click();

      // set send
      cy.getIframe()
        .find('#actionType')
        .type(action.type)

      cy.getIframe()
        .find('#actionValue')
        .type(JSON.stringify(action.data), { parseSpecialCharSequences: false })

      // send value
      cy.getIframe()
        .find('#sendAction')
        .click()

      // check if value is correct
      cy.get('#result').contains(JSON.stringify(action.data))  
    });
  });

    // Test actions which get data back
  ;[
    {
      type: 'getPageTitle',
      data: {},
      responseData: 'Product Listing - Shopware'
    },
  ].forEach((action) => {
    it(`"${action.type}" action`, () => {
      // set listener
      cy.get('#actionType').type(action.type);
      cy.get('#responseData').type(JSON.stringify(action.responseData));
      cy.get('#listenToAction').click();

      // set send
      cy.getIframe()
        .find('#actionType')
        .type(action.type)

      cy.getIframe()
        .find('#actionValue')
        .type(JSON.stringify(action.data), { parseSpecialCharSequences: false })

      // send value
      cy.getIframe()
        .find('#sendAction')
        .click()

      // check if value is correct
      cy.get('#result').contains(JSON.stringify(action.data))  
      cy.getIframe().find('#result').contains(JSON.stringify(action.responseData))  
    });
  })
})
