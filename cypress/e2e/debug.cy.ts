describe('Отладка селекторов', () => {
  it('показывает все data-cy атрибуты', () => {
    cy.visit('http://localhost:4000');
    
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Логируем заголовок страницы
    cy.title().then(title => {
      cy.log('Заголовок страницы:', title);
    });
    
    // Логируем все элементы с data-cy
    cy.get('[data-cy]').then(($elements) => {
      const attrs = [];
      $elements.each((i, el) => {
        const attr = el.getAttribute('data-cy');
        attrs.push(attr);
        cy.log(`Элемент ${i + 1}: data-cy="${attr}", текст: "${el.innerText?.substring(0, 30)}"`);
      });
      cy.log('Все найденные data-cy атрибуты:', attrs.join(', '));
    });
    
    // Проверяем ингредиенты
    cy.get('[data-cy=ingredient-item]').then(($items) => {
      cy.log(`Найдено ингредиентов: ${$items.length}`);
      
      $items.each((i, item) => {
        cy.log(`Ингредиент ${i + 1}: ${item.innerText}`);
        
        // Ищем внутри кнопки
        const buttons = item.querySelectorAll('button');
        cy.log(`  Кнопок внутри: ${buttons.length}`);
        
        buttons.forEach((btn, idx) => {
          cy.log(`  Кнопка ${idx + 1}: текст="${btn.innerText}", классы="${btn.className}"`);
        });
      });
    });
    
    // Проверяем модальное окно (если есть)
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=modal]').length) {
        cy.log('Модальное окно найдено!');
      } else {
        cy.log('Модального окна нет');
      }
    });
  });
});
