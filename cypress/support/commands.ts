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
  // Перехват запроса ингредиентов
  cy.intercept('GET', '*/ingredients', { fixture: 'ingredients' }).as(
    'getIngredients'
  );

  // Перехват запроса пользователя
  cy.intercept('GET', '*/auth/user', { fixture: 'user' }).as('getUser');

  // Перехват запроса создания заказа
  cy.intercept('POST', '*/orders', { fixture: 'order' }).as('createOrder');
});

// Команда для добавления ингредиентов в конструктор
Cypress.Commands.add('addIngredientsToConstructor', () => {
  // Добавляем булку
  cy.get('[data-cy=ingredient-item]').contains('Флюоресцентная булка').click();
  cy.get('[data-cy=modal]').within(() => {
    cy.contains('Добавить').click();
  });

  // Добавляем начинку
  cy.get('[data-cy=ingredient-item]').contains('Мясо бессмертных').click();
  cy.get('[data-cy=modal]').within(() => {
    cy.contains('Добавить').click();
  });

  // Добавляем соус
  cy.get('[data-cy=ingredient-item]').contains('Соус Spicy-X').click();
  cy.get('[data-cy=modal]').within(() => {
    cy.contains('Добавить').click();
  });
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
