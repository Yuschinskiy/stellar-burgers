/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.interceptRequests();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Загрузка ингредиентов', () => {
    it('должен загружать и отображать список ингредиентов', () => {
      // Проверяем, что ингредиенты загрузились (в моковых данных их 4)
      cy.get('[data-cy=ingredient-item]').should('have.length', 4);
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-cy=ingredient-item]')
        .contains('Флюоресцентная булка')
        .parents('[data-cy=ingredient-item]')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Флюоресцентная булка');
      cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Флюоресцентная булка');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-cy=ingredient-item]')
        .contains('Мясо бессмертных')
        .parents('[data-cy=ingredient-item]')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[data-cy=constructor-ingredient]').should('contain', 'Мясо бессмертных');
    });

    it('должен добавлять несколько ингредиентов разных типов', () => {
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

      cy.get('[data-cy=constructor-bun-top]').should('exist');
      cy.get('[data-cy=constructor-ingredient]').should('have.length', 2);
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.get('[data-cy=ingredient-link]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal]').contains('Детали ингредиента');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-cy=ingredient-link]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get('[data-cy=ingredient-link]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      
      // Клик на оверлей (если есть)
      cy.get('body').click(100, 100); // клик в левый верхний угол страницы
      
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setAuthTokens();
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('должен создавать заказ с собранным бургером', () => {
      cy.addIngredientsToConstructor();

      cy.get('[data-cy=order-button]').should('be.enabled');
      cy.get('[data-cy=order-button]').click();

      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy=order-modal]').should('be.visible');
      cy.get('[data-cy=order-number]').should('contain', '12345');

      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=order-modal]').should('not.exist');

      cy.get('[data-cy=constructor-bun-top]').should('not.exist');
      cy.get('[data-cy=constructor-ingredient]').should('not.exist');
    });

    it('должен очищать конструктор после успешного заказа', () => {
      cy.addIngredientsToConstructor();

      cy.get('[data-cy=order-button]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy=modal-close]').click();

      cy.get('[data-cy=constructor-bun-top]').should('not.exist');
      cy.get('[data-cy=constructor-ingredient]').should('not.exist');
      cy.get('[data-cy=total-price]').should('contain', '0');
    });
  });
});
