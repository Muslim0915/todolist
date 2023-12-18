window.addEventListener('DOMContentLoaded',()=>{
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

    let todos = [
        {id: 1, text: 'Learn JavaScript', completed: false},
        {id: 2, text: 'Learn React', completed: false},
        {id: 3, text: 'Learn Vue', completed: false},
    ];
    localStorage.setItem('todos', JSON.stringify(todos));
    const savedTodos = JSON.parse(localStorage.getItem('todos'));

    if (savedTodos) {
        todos = savedTodos;
    }


// Function to render the to-do list
    function renderTodoList() {
        todolist.innerHTML = ''; // Clear the existing list

        todos.forEach((todo) => {
            const newItem = document.createElement("div");
            newItem.className = "todo__item";
            newItem.innerHTML = `<span>${todo.text}</span> <button class="edit"></button>`;
            todolist.appendChild(newItem);
        });

    }

// Call the renderTodoList function to initially render the list

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
                editingElement.querySelector("span").textContent = text;
            } else {
                const newItem = document.createElement("div");
                newItem.className = "todo__item";
                newItem.innerHTML = `<span>${text}</span> <button class="edit"></button>`;
                todolist.appendChild(newItem);
                todos.push({id: Date.now(), text, completed: false});
                console.log(todos);
            }
            modalClose();
            editingElement = null;
            isEditMode = false; // Reset edit mode flag
            inputText.value = ''; // Clear the input field
        } else {
            showError(inputText, 'Заполните поле');
            inputText.classList.add('input_errored');
        }
    });

    deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (editingElement) {
            todolist.removeChild(editingElement);
            modalClose();
            editingElement = null;
            isEditMode = false; // Reset edit mode flag
            inputText.value =  ''; // Clear the input field
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
    renderTodoList();
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
});

