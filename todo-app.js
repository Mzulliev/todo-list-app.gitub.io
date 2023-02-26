(function () {

    // Создание заголовка
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle; 
    }

    // Создаение формы для добавления нового элемента в список дел
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // Создание спискка, который будет содержать элементы списка дел
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // Создание элемента списка
    function createTodoItem(name) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово',
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item, 
            doneButton,
            deleteButton,
        };
    }

    // Основная функция, которая создает прложение  для списка дел
    function createTodoApp(container, title = 'Список дел', userKey) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
      
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
      
        // Проверка, есть ли сохраненный список дел 
        // для пользователя в локальном хранилище браузера.
        // Если есть, ивлекает список дел из хранилища и создает
        // элементы списка для каждого элемента в списке дел
        let todoItems = [];
      
        if (userKey && localStorage.getItem(userKey)) {
          todoItems = JSON.parse(localStorage.getItem(userKey));
          todoItems.forEach(function (item) {
            let todoItem = createTodoItem(item.name);
            todoItem.item.classList.toggle('list-group-item-success', item.done);
            todoList.append(todoItem.item);
      
            todoItem.doneButton.addEventListener('click', function () {
              item.done = !item.done;
              todoItem.item.classList.toggle('list-group-item-success');
              saveDataToLocalStorage(userKey, todoItems);
            });
      
            todoItem.deleteButton.addEventListener('click', function () {
              if (confirm('Вы уверены?')) {
                let itemIndex = todoItems.indexOf(item);
                if (itemIndex > -1) {
                  todoItems.splice(itemIndex, 1);
                  saveDataToLocalStorage(userKey, todoItems);
                }
                todoItem.item.remove();
              }
            });
          });
        }
      
        // Событие, которое просиходит, когда пользователь отправляет 
        // форму для добавления нового элемента списка дел.
        // Создает новый жлемент саписка, добавляет его в список дел и 
        // сохраняет список дел в локалььном хранилище.
        todoItemForm.form.addEventListener('submit', function (event) {
          event.preventDefault();
      
          if (!todoItemForm.input.value) {
            return;
          }
      
          let todoItem = createTodoItem(todoItemForm.input.value);
      
          todoItems.push({ name: todoItemForm.input.value, done: false });
      
          todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');
          });
      
          todoItem.deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
              let itemIndex = todoItems.findIndex((item) => item.name === todoItemForm.input.value);
              if (itemIndex > -1) {
                todoItems.splice(itemIndex, 1);
                saveDataToLocalStorage(userKey, todoItems);
              }
              todoItem.item.remove();
            }
          });
      
          todoList.append(todoItem.item);
      
          saveDataToLocalStorage(userKey, todoItems);
      
          todoItemForm.input.value = '';
        });
      }
      
      function saveDataToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
      }

    window.createTodoApp = createTodoApp;
})();