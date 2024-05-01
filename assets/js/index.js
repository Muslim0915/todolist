/**
 * @fileoverview Скрипт для управления списком дел с модальным окном и возможностью редактирования, добавления и удаления элементов списка.
 */

/**
 * Получает модальное окно и другие элементы DOM.
 * @const {HTMLElement} modal - Модальное окно.
 * @const {HTMLElement} confirmModal - Модальное окно подтверждения.
 * @const {HTMLElement} createButton - Кнопка для открытия модального окна создания задачи.
 * @const {HTMLElement} inputText - Поле ввода для задач.
 * @const {HTMLElement} saveButton - Кнопка сохранения задачи.
 * @const {HTMLElement} deleteButton - Кнопка удаления задачи.
 * @const {HTMLElement} todolist - Контейнер списка задач.
 * @const {HTMLElement} modalCloseBtn - Кнопка закрытия модального окна.
 * @const {HTMLElement} stateTitle - Заголовок состояния в модальном окне.
 * @let {HTMLElement|null} editingElement - Элемент, редактируемый в настоящее время, если есть.
 * @let {boolean} isEditMode - Флаг, показывающий, происходит ли редактирование задачи.
 * @let {Array<Object>} todos - Список задач.
 */
const modal = document.querySelector(".modal");
const confirmModal = document.querySelector(".confirm-modal");
const createButton = document.querySelector(".modal-open__create-btn");
const inputText = document.querySelector("input");
const saveButton = document.querySelector(".save__button");
const deleteButton = document.querySelector(".danger-button");
const todolist = document.querySelector(".todolist__container");
const modalCloseBtn = document.querySelector(".modal-close__btn");
const stateTitle = document.querySelector(".modal-head__title span");

let editingElement = null;
let isEditMode = false;
let todos = JSON.parse(localStorage.getItem('todos')) || [];

/**
 * Открывает модальное окно создания задачи.
 */
function openCreateModal() {
    openModal('[Создание]', 'create');
}

/**
 * Открывает модальное окно редактирования задачи.
 */
function openEditModal() {
    openModal('[Редактирование]', 'edit');
    deleteButton.classList.remove('hidden');
}

/**
 * Открывает модальное окно с заданным заголовком и состоянием.
 * @param {string} title - Заголовок для модального окна.
 * @param {string} state - Состояние модального окна, может быть 'create' или 'edit'.
 */
function openModal(title, state) {
    modal.classList.add('modal-open');
    stateTitle.textContent = title;
    stateTitle.classList.toggle('create', state === 'create');
    stateTitle.classList.toggle('edit', state === 'edit');
    inputText.classList.toggle('creating', state === 'create');
    inputText.classList.toggle('editing', state === 'edit');
    deleteButton.classList.add('hidden');
}

/**
 * Закрывает модальное окно.
 */
function closeModal() {
    modal.classList.remove('modal-open');
    editingElement = null;
    isEditMode = false;
    inputText.value = '';
    removeErrors();
}

/**
 * Закрывает модальное окно при клике снаружи.
 * @param {Event} event - Событие клика.
 */
function closeOnOutsideClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

/**
 * Отображает список дел на основе данных в массиве `todos`.
 */
function renderTodoList() {
    todolist.innerHTML = '';

    todos.forEach((todo) => {
        const newItem = createTodoItem(todo);
        todolist.appendChild(newItem);
    });
}

/**
 * Создает элемент списка дел.
 * @param {Object} todo - Объект задачи.
 * @returns {HTMLElement} Новый элемент списка дел.
 */
function createTodoItem(todo) {
    const newItem = document.createElement("div");
    newItem.className = "todo__item";
    newItem.dataset.id = todo.id;
    newItem.innerHTML = `
    <span>${todo.title}</span>
    <button class="edit"></button>
  `;
    return newItem;
}

/**
 * Сохраняет задачу и обновляет список дел.
 */
function saveTodo() {
    const text = inputText.value.trim();
    removeErrors();

    if (isEditMode && editingElement) {
        if (!text) {
            openConfirmModal();
            return;
        }
        const editedTodo = todos.find(todo => todo.id === +editingElement.dataset.id);
        editedTodo.title = text;
    } else {
        if (!text) {
            showError(inputText, 'Заполните поле');
            inputText.classList.add('errored');
            return;
        }
        const newTodo = {
            id: Date.now(),
            title: text
        };

        todos.push(newTodo);
    }

    updateAndClose();
}

/**
 * Открывает модальное окно редактирования при клике на кнопку редактирования.
 * @param {Event} event - Событие клика.
 */
function openEditingModal(event) {
    if (event.target.classList.contains('edit')) {
        editingElement = event.target.parentNode;
        inputText.value = editingElement.querySelector('span').textContent;
        deleteButton.classList.remove('hidden');
        openEditModal();
        isEditMode = true;
    }
}

/**
 * Открывает модальное окно подтверждения.
 */
function openConfirmModal() {
    confirmModal.classList.add('modal-open');
}

/**
 * Закрывает модальное окно подтверждения.
 */
function closeConfirmModal() {
    confirmModal.classList.remove('modal-open');
}

/**
 * Удаляет задачу и обновляет список дел.
 * @param {Event} event - Событие клика.
 */
function deleteTodo(event) {
    event.preventDefault();

    if (editingElement) {
        todos = todos.filter(todo => todo.id !== +editingElement.dataset.id);
        updateAndClose();
    }
}

/**
 * Обрабатывает подтверждение или отмену удаления задачи.
 * @param {Event} event - Событие клика.
 */
function handleDeleteTodoConfirmation(event) {
    if (event.target.classList.contains('confirm-modal__cancel')) {
        closeConfirmModal();
    } else if (event.target.classList.contains('confirm-modal__confirm')) {
        deleteTodo(event);
        closeConfirmModal();
    }
}

/**
 * Обновляет список дел и закрывает модальное окно.
 */
function updateAndClose() {
    renderTodoList();
    saveToLocalStorage();
    closeModal();
}

/**
 * Сохраняет список дел в локальное хранилище.
 */
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Отображает сообщение об ошибке для указанного поля.
 * @param {HTMLElement} field - Поле, где будет отображено сообщение об ошибке.
 * @param {string} message - Сообщение об ошибке.
 */
function showError(field, message) {
    const errorElement = document.createElement('small');
    errorElement.classList.add('error');
    errorElement.textContent = message;
    field.closest('.form-control').appendChild(errorElement);
}

/**
 * Удаляет сообщения об ошибке из формы.
 */
function removeErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.remove());
    inputText.classList.remove('errored');
}

// Добавляем обработчики событий к кнопкам и элементам страницы
createButton.addEventListener('click', openCreateModal);
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', closeOnOutsideClick);
todolist.addEventListener('click', openEditingModal);
deleteButton.addEventListener('click', deleteTodo);
saveButton.addEventListener('click', saveTodo);

confirmModal.addEventListener('click', handleDeleteTodoConfirmation);

// Отображаем список дел при загрузке страницы
window.onload = () => renderTodoList();
