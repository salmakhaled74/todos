
const logouts = document.querySelectorAll('.logout');
const Add = document.querySelectorAll('.add');
const editIcons = document.querySelectorAll('.edit-icon');
const newDiv = document.querySelectorAll('.todo-item');
const iconsDiv = document.querySelectorAll('.icons');
const deleteIcons = document.querySelectorAll('.delete-icon');
const completeIcons = document.querySelectorAll('.status-icon');
const todoforms = document.querySelectorAll('.todo-form');
const addTodoForm = document.querySelector('.todo-form');
const loginForm = document.querySelector('.login-card-form');

const dateIcons = document.querySelectorAll('.date-icon');

const formItem = document.querySelectorAll('.form-item');
const formItemContainer = document.querySelectorAll('.form-item-container');
const emailBorder = document.querySelector('.i1');
const passwordBorder = document.querySelector('.i2');


// loginForm.addEventListener('submit', event => {
//   event.preventDefault();
//   const email = document.querySelector('.i1').value;
//   const password = document.querySelector('.i2').value;
//   if (!email || !password) {
//     emailBorder.style.border = '1px solid red';
//     passwordBorder.style.border = '1px solid red';
//     formItemContainer.forEach(container => {
//       const message = document.createElement('div');
//       message.innerText = 'Please enter your email and password.';
//       message.style.color = 'red';
//       message.style.fontSize = '15px';
//       message.style.marginTop = '5px';
//       message.style.alignItems = 'center';
//       message.style.display = 'flex';
//       message.style.justifyContent = 'center';
//       container.appendChild(message);
//       container.appendChild(message);
//     });
//     return;
//   }

//   // fetch('/login', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   }
//   // })
//   //   .then(response => {
//   //     if (!response.ok) {
//   //       alert('Invalid email or password.');
//   //       emailBorder.style.border = '1px solid red';
//   //       passwordBorder.style.border = '1px solid red';
//   //       formItemContainer.forEach(container => {
//   //         const message = document.createElement('div');
//   //         message.innerText = 'Wrong email or password.';
//   //         message.style.color = 'red';
//   //         message.style.fontSize = '15px';
//   //         message.style.marginTop = '5px';
//   //         message.style.alignItems = 'center';
//   //         message.style.display = 'flex';
//   //         message.style.justifyContent = 'center';
//   //         container.appendChild(message);
//   //         container.appendChild(message);
//   //       });
//   //     }
//   //   })
// });


completeIcons.forEach((completeIcon, index) => {
  completeIcon.addEventListener('click', async (event) => {
    event.preventDefault();
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
      newDiv[index].style.backgroundColor = '#ff32ad';
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
  editIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    const todoId = editIcon.getAttribute('data-id');
    const todoItem = document.getElementById(todoId);
    const todoText = todoItem.querySelector('.todo-item');
    const editForm = document.createElement('form');
    const editInput = document.createElement('input');
    editForm.className = 'edit-form';
    editInput.className = 'edit-input';
    editInput.type = 'text';
    editInput.value = todoText.innerText;
    editForm.appendChild(editInput);
    todoItem.replaceChild(editForm, todoText);
    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const editedTask = editInput.value;
      console.log(editedTask);
      try {
        const response = await fetch(`/todo/${todoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task: editedTask }),
        });
        if (!response.ok) {
          throw new Error('Failed to edit todo');
        }
        todoItem.replaceChild(todoText, editForm);
        todoText.innerText = editedTask;
      } catch (error) {
        console.error(error);
      }
    });
  });
});




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
          style="display:inline-block; margin-left:20px; border:5px solid #ff32ad; border-radius:30px;
          text-align:center; display:flex; flex-direction:column; justify-content:center; 
          text-align:center; width:300px; padding:10px; margin-top:5px; margin-left:350px; height:50px;
          background-color:white; color:black; font-size:25px; font-weight:normal; display:flex; align-items:center;">
          ${task}
        </div>
        <div class="icons" style="display:flex; justify-content:center; align-items:center">
          <a href="#" data-id="${newTodo._id}" class="status-icon">
            <i class="fas fa-regular fa-circle-check fa-2xl" style="color:#ff32ad; padding-left:10px;"></i>
          </a>
          <i class="fa-solid fa-calendar-days fa-2xl" style="color:#ff32ad; padding-left:10px;"></i>
          <i class="fa-solid fa-pen-to-square fa-2xl" style="color:#ff32ad; padding-left:10px;"></i>
          <a href="#" data-id="${newTodo._id}" class="delete-icon">
            <i class="fa-solid fa-trash fa-2xl" style="color:#ff32ad; padding-left:10px;"></i>
          </a>
        </div>
      </div>
    `;
    todoList.appendChild(newTodoElement);
  } catch (err) {
    console.error(err);
  }
});


deleteIcons.forEach((deleteIcon) => {
  deleteIcon.addEventListener('click', async (event) => {
    event.preventDefault();
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


document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  console.log('hi');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [
      {
        title: 'Event 1',
        start: '2023-04-18T10:00:00',
        end: '2023-04-18T12:00:00'
      },
      {
        title: 'Event 2',
        start: '2023-04-20T14:00:00',
        end: '2023-04-20T16:00:00'
      }
    ]
  });
  calendar.render();
});


dateIcons.forEach((dateIcon, index) => {
  dateIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    const todoId = dateIcon.getAttribute('data-id');
    const todoItem = document.getElementById(todoId);
    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = 'datepicker';
    dateInput.classList.add('datepicker-input');
    const datepicker = flatpickr(dateInput,
      {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        defaultDate: "today"
      });
    try {
      const response = await fetch(`/todo/${todoId}/date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: datepicker.selectedDates[0].toISOString() })
      });
      if (response.ok) {
        console.log(response);
        const todoText = todoItem.querySelector('.todo-text');
        todoItem.insertBefore(dateInput, todoText);
        todoItem.classList.add('todo-item1');
        console.log(datepicker.selectedDates[0]);
      }
    } catch (err) {
      console.error(err);
    }
  });
});

const clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    const response = await fetch('/todo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    const todoList = document.querySelectorAll('.todo-item');
    const IconsList = document.querySelectorAll('.icons');
    const secretList = document.querySelectorAll('.secret');
    IconsList.forEach(icon => icon.remove());
    secretList.forEach(secret => secret.remove());
    todoList.forEach(todoItem => todoItem.remove());

  } catch (error) {
    console.error(error);
  }
});



function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : null;
}

logouts.forEach((logout) => {
  logout.addEventListener('click', (event) => {
    event.preventDefault();
    const token = getCookie('token');
    fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response);
        console.log('redirecting to home...');
        window.location.href = '/home';
      })
      .catch(err => {
        console.log(err);
      });
  });
});


const signUpbtn = document.querySelector('.b');
signUpbtn.addEventListener('click', () => {
  window.location.href = '/index.html';
});


