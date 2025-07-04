const todoList = JSON.parse(localStorage.getItem('todoList')) || {};

window.onload = () => {
  for (const id in todoList) {
    renderTodos(id, todoList[id]);
  }
};

function saveTodos() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

document.querySelector('.save-button').addEventListener('click', () => {
  addTodos();
});

function addTodos() {
  const inputTitle = document.querySelector('.input-title');
  const inputDesc = document.querySelector('.input-desc');

  const title = inputTitle.value.trim();
  const description = inputDesc.value.trim();

  if (!title || !description) {
    alert('Please fill out both fields.');
    return;
  }

  const id = Date.now();
  todoList[id] = { title, description };

  saveTodos();
  renderTodos(id, todoList[id]);

  inputTitle.value = '';
  inputDesc.value = '';
}

function renderTodos(id, todo) {
  const todoContainer = document.querySelector('.todo-container');

  const todoDiv = document.createElement('div');

  const titleSpan = document.createElement('span');
  titleSpan.textContent = todo.title;

  const descSpan = document.createElement('span');
  descSpan.textContent = todo.description;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  deleteBtn.addEventListener('click', () => {
    delete todoList[id];
    todoDiv.remove();
    saveTodos();
  });

  todoDiv.appendChild(titleSpan);
  todoDiv.appendChild(descSpan);
  todoDiv.appendChild(deleteBtn);
  todoContainer.appendChild(todoDiv);
}