window.addEventListener('DOMContentLoaded',()=>{
    const createButton = document.querySelector('.modal-open__btn');
    const modal = document.querySelector("#modal");
    const inputText = document.querySelector("#input__text");
    const saveButton = document.querySelector("#save__button");
    const deleteButton = document.querySelector("#delete__button");
    const todolist = document.querySelector(".todo__list");
    const modalCloseBtn = document.querySelector('.modal-close__btn');
    let editingElement = null;
    let isEditMode = false; // Flag to track edit mode
    const edits = document.querySelectorAll('.edit')

    const todos = [
        {id: 1, text: 'Learn JavaScript', completed: false},
        {id: 2, text: 'Learn React', completed: false},
        {id: 3, text: 'Learn Vue', completed: false},
    ];

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
        deleteButton.style.display = 'none';
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
            inputText.value = ''; // Clear the input field
        }
    });

todolist.addEventListener("click", (event) => {

    if (event.target.classList.contains("edit")) {
        console.log(event.target.closest('.form-control .input'));
        editingElement = event.target.parentNode;
        modalOpen();
        deleteButton.style.display = 'block';
        const span = document.querySelector(".modal-head__title span");
        span.textContent = "[Редактирование]";
        span.style.color = '#F4C959';
        isEditMode = true; // Set edit mode flag
    }
});



    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            editingElement = null;
            inputText.value = ''; // Clear the input field
            modalClose();
            isEditMode = false; // Reset edit mode flag
        }
    });

    function modalOpen() {
        return modal.classList.add('modal-open');
    }

    function modalClose() {
        return modal.classList.remove('modal-open');
    }

    modalCloseBtn.addEventListener('click', modalClose);

    const showError = (field, message) => {
        const errorElement = document.createElement('small');
        errorElement.classList.add('error');
        errorElement.textContent = message;
        field.closest('.form-control').appendChild(errorElement);
    };
    renderTodoList();

})