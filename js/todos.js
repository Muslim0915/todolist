"use strict";
const modal = document.querySelector('#modal');
const modalContainer = document.querySelector('.modal__container');
const todoListContainer = document.querySelector('.todo__list');
const modalOpenBtn = document.querySelector('.modal-open__btn');
const todos = [
    {id: 1, text: 'Learn JavaScript', completed: false},
    {id: 2, text: 'Learn React', completed: false},
    {id: 3, text: 'Learn Vue', completed: false},
];
const modalOpen = () => {
    modal.classList.add('modal-open');
}
const modalClose = () => {
    modal.classList.remove('modal-open');
}

modalOpenBtn.addEventListener('click', modalOpen);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modalClose();
    }
});
const todoCreate = () => {
    const todo = {
        id: todos.length + 1,
        text: document.querySelector('#input__text').value,
        completed: false,
    }
    todos.push(todo);
    todoListContainer.insertAdjacentElement('beforeend', todoItem(todo));
}
const todoItem = (todo) => {
    const todoItemElement = document.createElement('div');
    todoItemElement.classList.add('todo__item');
    todoItemElement.dataset.id = todo.id;
    todoItemElement.innerHTML = `
        <div class="todo__item-text">${todo.text}</div>
        <button class="edit" onclick="todoUpdate(${todo.id})"></button>
    `;
    return todoItemElement;
}

const todoUpdate = (id) => {

}

const todoDelete = (id) => {


}

function todoAddContainer() {
    return `
 <div class="modal-head">
            <div class="modal-head__title">Задача на сегодня <span>[Создание]</span></div>
            <button class="modal-close__btn" onclick="modalClose()"></button>

        </div>

        <form action="#">
            <div class="form-control">
                <label for="input__text">Название</label>
                <input type="text" id="input__text" placeholder="Введите текст">
            </div>
            <div class="form-control">
                <button id="save__button" type="submit" onclick="checkError();">Сохранить</button>
            </div>
        </form> 
    `
}
function showError(field, message) {
    const errorElement = document.createElement('small');
    errorElement.classList.add('error');
    errorElement.textContent = message;
    field.closest('.form-control').appendChild(errorElement);
}

function checkError() {
    const inputText = document.querySelector('#input__text');
    if (inputText.value === '') {
        showError(inputText, 'Заполните поле');
        inputText.classList.add('input_errored');
        return;
    }
    else {
        modalClose();
        todoCreate();
    }
}

const todoCreateContainer = () =>{
    const todoAddContainerElement = todoAddContainer();
    todoListContainer.insertAdjacentHTML('beforeend', todoAddContainerElement);
}
