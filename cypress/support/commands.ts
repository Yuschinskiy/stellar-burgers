/// <reference types="cypress" />
// ***********************************************
// Команда для установки моковых токенов авторизации
Cypress.Commands.add('setAuthTokens', () => {
  cy.fixture('tokens').then((tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    cy.setCookie('accessToken', tokens.accessToken);
  });
});

// НОВАЯ КОМАНДА: очистка токенов
Cypress.Commands.add('clearAuthTokens', () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

// Команда для перехвата запросов к API
Cypress.Commands.add('interceptRequests', () => {
  cy.intercept('GET', '*/ingredients', { fixture: 'ingredients' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '*/auth/user', { fixture: 'user' }).as('getUser');
  cy.intercept('POST', '*/orders', { fixture: 'order' }).as('createOrder');
});

// Команда для добавления ингредиентов
Cypress.Commands.add('addIngredientsToConstructor', () => {
  cy.get('[data-cy=ingredient-item]')
    .contains('Флюоресцентная булка')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
  
  cy.get('[data-cy=ingredient-item]')
    .contains('Мясо бессмертных')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
  
  cy.get('[data-cy=ingredient-item]')
    .contains('Соус Spicy-X')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>; // НОВЫЙ ТИП
      interceptRequests(): Chainable<void>;
      addIngredientsToConstructor(): Chainable<void>;
    }
  }
}
