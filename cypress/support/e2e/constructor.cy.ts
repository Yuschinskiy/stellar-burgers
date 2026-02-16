describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы перед каждым тестом
    cy.interceptRequests();
    // Посещаем главную страницу
    cy.visit('/');
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Загрузка ингредиентов', () => {
    it('должен загружать и отображать список ингредиентов', () => {
      cy.get('[data-cy=ingredient-item]').should('have.length', 4);
      cy.get('[data-cy=ingredient-item]')
        .first()
        .contains('Флюоресцентная булка');
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      // Находим булку и добавляем её
      cy.get('[data-cy=ingredient-item]').contains('Флюоресцентная булка').click();
      cy.get('[data-cy=modal]').within(() => {
        cy.contains('Добавить').click();
      });

      // Проверяем, что булка появилась в конструкторе
      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Флюоресцентная булка');
      cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Флюоресцентная булка');
    });

    it('должен добавлять начинку в конструктор', () => {
      // Добавляем мясо
      cy.get('[data-cy=ingredient-item]').contains('Мясо бессмертных').click();
      cy.get('[data-cy=modal]').within(() => {
        cy.contains('Добавить').click();
      });

      // Проверяем, что начинка появилась
      cy.get('[data-cy=constructor-ingredient]').should('contain', 'Мясо бессмертных');
    });

    it('должен добавлять несколько ингредиентов разных типов', () => {
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

      // Проверяем, что все ингредиенты в конструкторе
      cy.get('[data-cy=constructor-bun-top]').should('exist');
      cy.get('[data-cy=constructor-ingredient]').should('have.length', 2);
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открывать модальное окно при клике на ингредиент', () => {
      cy.get('[data-cy=ingredient-item]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal]').contains('Детали ингредиента');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-cy=ingredient-item]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get('[data-cy=ingredient-item]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен показывать правильные данные ингредиента в модальном окне', () => {
      cy.get('[data-cy=ingredient-item]').first().click();
      cy.get('[data-cy=modal]').within(() => {
        cy.contains('Флюоресцентная булка');
        cy.contains('Калории,ккал').siblings().contains('643');
        cy.contains('Белки,г').siblings().contains('44');
        cy.contains('Жиры,г').siblings().contains('26');
        cy.contains('Углеводы,г').siblings().contains('85');
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем моковые токены авторизации
      cy.setAuthTokens();
      // Обновляем страницу, чтобы применились токены
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('должен создавать заказ с собранным бургером', () => {
      // Собираем бургер
      cy.addIngredientsToConstructor();

      // Проверяем, что кнопка активна
      cy.get('[data-cy=order-button]').should('be.enabled');

      // Нажимаем кнопку оформления заказа
      cy.get('[data-cy=order-button]').click();

      // Ждем ответа от сервера
      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

      // Проверяем, что модальное окно с заказом открылось
      cy.get('[data-cy=order-modal]').should('be.visible');
      
      // Проверяем номер заказа
      cy.get('[data-cy=order-number]').should('contain', '12345');

      // Закрываем модальное окно
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=order-modal]').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get('[data-cy=constructor-bun-top]').should('not.exist');
      cy.get('[data-cy=constructor-ingredient]').should('not.exist');
    });

    it('должен показывать ошибку при создании заказа без булки', () => {
      // Добавляем только начинку, без булки
      cy.get('[data-cy=ingredient-item]').contains('Мясо бессмертных').click();
      cy.get('[data-cy=modal]').within(() => {
        cy.contains('Добавить').click();
      });

      // Проверяем, что кнопка неактивна
      cy.get('[data-cy=order-button]').should('be.disabled');
    });

    it('должен очищать конструктор после успешного заказа', () => {
      // Собираем бургер
      cy.addIngredientsToConstructor();

      // Оформляем заказ
      cy.get('[data-cy=order-button]').click();
      cy.wait('@createOrder');

      // Закрываем модальное окно
      cy.get('[data-cy=modal-close]').click();

      // Проверяем, что конструктор пуст
      cy.get('[data-cy=constructor-bun-top]').should('not.exist');
      cy.get('[data-cy=constructor-ingredient]').should('not.exist');
      
      // Проверяем, что общая сумма стала 0
      cy.get('[data-cy=total-price]').should('contain', '0');
    });
  });

  describe('Авторизация при создании заказа', () => {
    it('должен использовать моковые токены в запросе', () => {
      // Устанавливаем токены
      cy.setAuthTokens();

      // Перехватываем запрос создания заказа и проверяем заголовки
      cy.intercept('POST', '*/orders', (req) => {
        expect(req.headers).to.have.property('authorization');
        expect(req.headers.authorization).to.include('Bearer');
        req.reply({ fixture: 'order' });
      }).as('orderWithAuth');

      cy.reload();
      cy.wait('@getIngredients');

      // Собираем бургер и создаем заказ
      cy.addIngredientsToConstructor();
      cy.get('[data-cy=order-button]').click();

      // Проверяем, что запрос ушел с токеном
      cy.wait('@orderWithAuth');
    });
  });
});
