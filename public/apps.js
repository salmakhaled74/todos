const logout = document.querySelectorAll('.logout');
const Add = document.querySelectorAll('.add');
const editIcons = document.querySelectorAll('.fa-solid.fa-calendar-days.fa-2xl');
const newDiv = document.querySelectorAll('.todo-item');
const iconsDiv = document.querySelectorAll('.icons');
const deleteIcons = document.querySelectorAll('.delete-icon');
const completeIcons = document.querySelectorAll('.status-icon');
const todoforms = document.querySelectorAll('.todo-form');

const addTodoForm = document.querySelector('.todo-form');

addTodoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const taskInput = document.querySelector('.task-input');
  const task = taskInput.value;
  taskInput.value = '';
  try {
    const response = await fetch('/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    });
    const newTodo = await response.json();
    const todoList = document.querySelector('.todo-list');
    const newTodoElement = document.createElement('div');
    newTodoElement.innerHTML = `
      <div id="${newTodo._id}" style="display:flex; margin-left:50px;">
        <div class="todo-item"
          style="display:inline-block; margin-left:20px; border:5px solid #FF69B4; border-radius:30px;
          text-align:center; display:flex; flex-direction:column; justify-content:center; 
          text-align:center; width:300px; padding:10px; margin-top:5px; margin-left:350px; height:50px;
          background-color:white; color:black; font-size:25px; font-weight:normal; display:flex; align-items:center;">
          ${task}
        </div>
        <div class="icons" style="display:flex; justify-content:center; align-items:center">
          <a href="#" data-id="${newTodo._id}" class="status-icon">
            <i class="fas fa-regular fa-circle-check fa-2xl" style="color:#FF69B4; padding-left:10px;"></i>
          </a>
          <i class="fa-solid fa-calendar-days fa-2xl" style="color:#FF69B4; padding-left:10px;"></i>
          <i class="fa-solid fa-pen-to-square fa-2xl" style="color:#FF69B4; padding-left:10px;"></i>
          <a href="#" data-id="${newTodo._id}" class="delete-icon">
            <i class="fa-solid fa-trash fa-2xl" style="color:#FF69B4; padding-left:10px;"></i>
          </a>
        </div>
      </div>
    `;
    todoList.appendChild(newTodoElement);
  } catch (err) {
    console.error(err);
  }
});


completeIcons.forEach((completeIcon, index) => {
  completeIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    alert('Complete');
    const todoId = completeIcon.getAttribute('data-id');
    try {
      const response = await fetch(`/todo/${todoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
      newDiv[index].style.textDecoration = 'line-through';
      newDiv[index].style.color = 'white';
      newDiv[index].style.backgroundColor = '#FF69B4';
      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
        },
        colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
        shapes: ['circle', 'square', 'triangle', 'heart'],
      });
    } catch (error) {
      console.error(error);
    }
  })
});




editIcons.forEach((editIcon, index) => {
  editIcon.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Edit');
  });
});

deleteIcons.forEach((deleteIcon) => {
  deleteIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    alert('Delete');
    const todoId = deleteIcon.getAttribute('data-id');

    try {
      const response = await fetch(`/todo/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      const todoElement = document.getElementById(todoId);
      todoElement.remove();
    } catch (error) {
      console.error(error);
    }
  });
});


logout.addEventListener('click', (event) => {
  event.preventDefault();
  alert('Logout');
  fetch('/logout', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      console.log(response);
      console.log('redirecting to login...');
      window.location.href = '/login';
    })
    .catch(err => {
      console.log(err);
    });
});