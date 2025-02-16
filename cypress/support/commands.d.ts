/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to drag an element to a target.
     * @example cy.get(selector).drag(target, { force: true })
     */
    drag(target: string | JQuery<HTMLElement>, options?: Partial<{ force: boolean }>): Chainable<Subject>;
  }
}