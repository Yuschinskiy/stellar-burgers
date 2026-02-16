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

      cy.get('[data-cy=constructor-bun-top]').should(
        'contain',
        'Флюоресцентная булка'
      );
      cy.get('[data-cy=constructor-bun-bottom]').should(
        'contain',
        'Флюоресцентная булка'
      );
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-cy=ingredient-item]')
        .contains('Мясо бессмертных')
        .parents('[data-cy=ingredient-item]')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('[data-cy=constructor-ingredient]').should(
        'contain',
        'Мясо бессмертных'
      );
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
    it('должен открывать модальное окно с правильными данными ингредиента', () => {
      // Кликаем на конкретный ингредиент
      cy.get('[data-cy=ingredient-link]')
        .contains('Флюоресцентная булка')
        .click();

      // Проверяем наличие модального окна
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal]')
        .contains('Детали ингредиента')
        .should('be.visible');

      // Проверяем данные ингредиента
      cy.get('[data-cy=modal]').within(() => {
        // Название ингредиента
        cy.contains('Флюоресцентная булка').should('be.visible');
        
        // В модальном окне нет цены, поэтому НЕ проверяем '988'
        
        // Проверяем наличие всех питательных веществ
        cy.contains('Калории, ккал').should('be.visible');
        cy.contains('Белки, г').should('be.visible');
        cy.contains('Жиры, г').should('be.visible');
        cy.contains('Углеводы, г').should('be.visible');
        
        // Проверяем значения питательных веществ
        cy.contains('643').should('be.visible');
        cy.contains('44').should('be.visible');
        cy.contains('26').should('be.visible');
        cy.contains('85').should('be.visible');
      });
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-cy=ingredient-link]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверяем, что URL вернулся к исходному
      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get('[data-cy=ingredient-link]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');

      // Клик на оверлей
      cy.get('body').click(100, 100);

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

    afterEach(() => {
      // Очищаем токены после каждого теста
      cy.clearAuthTokens();
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
