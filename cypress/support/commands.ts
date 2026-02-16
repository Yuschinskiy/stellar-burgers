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

// Команда для перехвата запросов к API
Cypress.Commands.add('interceptRequests', () => {
  cy.intercept('GET', '*/ingredients', { fixture: 'ingredients' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '*/auth/user', { fixture: 'user' }).as('getUser');
  cy.intercept('POST', '*/orders', { fixture: 'order' }).as('createOrder');
});

// ИСПРАВЛЕННАЯ КОМАНДА - ищем кнопку по тексту "Добавить"
Cypress.Commands.add('addIngredientsToConstructor', () => {
  // Добавляем булку
  cy.get('[data-cy=ingredient-item]')
    .contains('Флюоресцентная булка')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
  
  // Добавляем начинку
  cy.get('[data-cy=ingredient-item]')
    .contains('Мясо бессмертных')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
  
  // Добавляем соус
  cy.get('[data-cy=ingredient-item]')
    .contains('Соус Spicy-X')
    .parents('[data-cy=ingredient-item]')
    .find('button')
    .contains('Добавить')
    .click();
});

// Объявляем типы для TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      interceptRequests(): Chainable<void>;
      addIngredientsToConstructor(): Chainable<void>;
    }
  }
}
