window.addEventListener('DOMContentLoaded', async () => {
    const createButton = document.querySelector('.modal-open__btn');
    const modal = document.querySelector("#modal");
    const inputText = document.querySelector("input");
    const saveButton = document.querySelector(".save__button");
    const deleteButton = document.querySelector(".delete__button");
    const todolist = document.querySelector(".todo__list");
    const modalCloseBtn = document.querySelector('.modal-close__btn');
    const modalTitleSpan = document.querySelector(".modal-head__title span");
    let editingElement = null;
    let isEditMode = false; // Flag to track edit mode
    const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
    let isLoading = false;
    let loadingSpinner = document.querySelector('.loading__spinner');

    // Переносим логику загрузки задач из локального хранилища в функцию
    const fetchTodo = async () => {
        try {
            isLoading = true
            const res = await fetch(API_URL);
            if (!res.ok) {
                throw new Error(`Failed to fetch tasks. Status: ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            console.error(err);
            throw err; // Передаем ошибку выше для обработки вне этой функции, если нужно
        }
        finally {
            isLoading = false;
        }
    };

// Вместо загрузки задач из локального хранилища, используем fetchTodo
    let todos = await fetchTodo() || [
    ];
    async function loadData() {
        try {
            isLoading = true;
            todos = await fetchTodo() || todos;
            await updateLocalStorage();
            renderTodoList(); // Перерисовываем список после загрузки
        } catch (error) {
            console.error('Failed to load data:', error);
        }
        finally {
            isLoading = false;
        }
    }

// Вызываем loadData() при загрузке страницы или в другом подходящем месте
    await loadData();
    function showSpinner() {
        if (isLoading){
            loadingSpinner.classList.add('show');
            loadingSpinner.classList.remove('hidden')
        }
        else{
            loadingSpinner.classList.add('hidden');
            loadingSpinner.classList.remove('show');
        }
    }
    showSpinner();


    console.log(todos);

    // Function to render the to-do list
    function renderTodoList() {
        todolist.innerHTML = ''; // Clear the existing list

        todos.forEach((todo) => {
            const newItem = document.createElement("div");
            newItem.className = "todo__item";
            newItem.dataset.id = todo.id; // Save id in dataset attribute
            newItem.innerHTML = `<span>${todo.title}</span> <button class="edit"></button>`;
            todolist.appendChild(newItem);
        });
    }

    // Call the renderTodoList function to initially render the list
    renderTodoList();

    createButton.addEventListener("click", () => {
        modalOpen();
        editingElement = null;
        inputText.value = ''; // Clear the input field
        isEditMode = false; // Reset edit mode flag
        modalTitleSpan.textContent = '[Создание]';
        modalTitleSpan.classList.add('create');
        modalTitleSpan.classList.remove('edit')
        inputText.classList.remove('editing');
        inputText.classList.add('creating')
        deleteButton.classList.add('hidden');
        if (!isEditMode) {
            inputText.value = ''; // Clear the input field only if not in edit mode
        }
    });

    saveButton.addEventListener("click", (event) => {
        event.preventDefault();

        const text = inputText.value;

        if (text.trim() !== "") {
            if (editingElement) {
                // Editing existing todo
                const editedTodo = todos.find(todo => todo.id === +editingElement.dataset.id);
                editedTodo.title = text;
            } else {
                // Creating a new todo
                const newTodo = {id: Date.now(), title: text, completed: false};
                todos.push(newTodo);
            }
            modalClose();
            editingElement = null;
            isEditMode = false; // Reset edit mode flag
            inputText.value = ''; // Clear the input field
            updateLocalStorage();
            renderTodoList();
            console.log(todos);
        } else {
            showError(inputText, 'Заполните поле');
            inputText.classList.add('input_errored');
        }
    });

    deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (editingElement) {
            // Deleting an existing todo
            const deletedTodoIndex = todos.findIndex(todo => todo.id === +editingElement.dataset.id);
            todos.splice(deletedTodoIndex, 1);
            modalClose();
            editingElement = null;
            isEditMode = false; // Reset edit mode flag
            inputText.value = ''; // Clear the input field
            updateLocalStorage();
            renderTodoList();
        }
    });

    todolist.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit")) {
            editingElement = event.target.parentNode;
            inputText.value = editingElement.querySelector("span").textContent;
            modalOpen();
            deleteButton.classList.remove('hidden');
            modalTitleSpan.textContent = "[Редактирование]";
            modalTitleSpan.classList.add('edit');
            modalTitleSpan.classList.remove('create');
            isEditMode = true; // Set edit mode flag
            inputText.classList.add('editing');
            inputText.classList.remove('creating');
        }
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            editingElement = null;
            inputText.value = '';
            modalClose();
            isEditMode = false;
        }
    });

    function modalOpen() {
        return modal.classList.add('modal-open');
    }

    function modalClose() {
        modal.classList.remove('modal-open');
        removeErrors();
    }

    modalCloseBtn.addEventListener('click', modalClose);

    const showError = (field, message) => {
        const errorElement = document.createElement('small');
        errorElement.classList.add('error');
        errorElement.textContent = message;
        field.closest('.form-control').appendChild(errorElement);
    };

    function removeErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach((error) => {
            error.remove();
        });
        const inputError = document.querySelector('.input_errored');
        if (inputError) {
            inputError.classList.remove('input_errored');
        }
    }

   async function updateLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos))
    }
});
