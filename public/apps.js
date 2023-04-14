const logout = document.querySelectorAll('.logout');
const Add = document.querySelectorAll('.add');
const editIcons = document.querySelectorAll('.fa-solid.fa-calendar-days.fa-2xl');
const newDiv = document.querySelectorAll('.todo-item');
const iconsDiv = document.querySelectorAll('.icons');
const deleteIcons = document.querySelectorAll('.delete-icon');
const completeIcons = document.querySelectorAll('.status-icon');
const todoforms = document.querySelectorAll('.todo-form');

todoforms.forEach((todoform, index) => {
  const taskInput = document.querySelector('.task-input');
  todoform.addEventListener('submit', async (event) => {
    event.preventDefault();
    alert('Add');
    const task = taskInput.value;
    console.log(task);
    await fetch('/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const todoItem = document.createElement('div');
        todoItem.id = todo._id;
        todoItem.classList.add('todo-item');
        todoItem.style.display = 'flex';
        todoItem.style.marginLeft = '50px';

        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');
        todoContent.style.display = 'inline-block';
        todoContent.style.marginLeft = '20px';
        todoContent.style.border = '5px solid #FF69B4';
        todoContent.style.borderRadius = '30px';
        todoContent.style.textAlign = 'center';
        todoContent.style.display = 'flex';
        todoContent.style.flexDirection = 'column';
        todoContent.style.justifyContent = 'center';
        todoContent.style.textAlign = 'center';
        todoContent.style.width = '300px';
        todoContent.style.padding = '10px';
        todoContent.style.marginTop = '5px';
        todoContent.style.marginLeft = '350px';
        todoContent.style.height = '50px';
        todoContent.style.backgroundColor = 'white';
        todoContent.style.color = 'black';
        todoContent.style.fontSize = '25px';
        todoContent.style.fontWeight = 'normal';
        todoContent.style.display = 'flex';
        todoContent.style.alignItems = 'center';
        todoContent.innerHTML = todo.task;

        const icons = document.createElement('div');
        icons.classList.add('icons');
        icons.style.display = 'flex';
        icons.style.justifyContent = 'center';
        icons.style.alignItems = 'center';

        const statusIconLink = document.createElement('a');
        statusIconLink.href = '#';
        statusIconLink.dataset.id = todo._id;
        statusIconLink.classList.add('status-icon');

        const statusIcon = document.createElement('i');
        statusIcon.classList.add('fas', 'fa-regular', 'fa-circle-check', 'fa-2xl');
        statusIcon.style.color = '#FF69B4';
        statusIcon.style.paddingLeft = '10px';

        const calendarIcon = document.createElement('i');
        calendarIcon.classList.add('fa-solid', 'fa-calendar-days', 'fa-2xl');
        calendarIcon.style.color = '#FF69B4';
        calendarIcon.style.paddingLeft = '10px';

        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pen-to-square', 'fa-2xl');
        editIcon.style.color = '#FF69B4';
        editIcon.style.paddingLeft = '10px';

        const deleteIconLink = document.createElement('a');
        deleteIconLink.href = '#';
        deleteIconLink.dataset.id = todo._id;
        deleteIconLink.classList.add('delete-icon');

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'fa-2xl');
        deleteIcon.style.color = '#FF69B4';
        deleteIcon.style.paddingLeft = '10px';

        statusIconLink.appendChild(statusIcon);
        icons.appendChild(statusIconLink);
        icons.appendChild(calendarIcon);
        icons.appendChild(editIcon);
        deleteIconLink.appendChild(deleteIcon);
        icons.appendChild(deleteIconLink);

        todoItem.appendChild(todoContent);
        todoItem.appendChild(icons);
        console.log('Todo added');

        const todoList = document.querySelector('.todo-list');
        todoList.appendChild(todoItem);
      });
  });
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