const todoForm = document.querySelector('.todo-form');
const Add = document.querySelector('.add');
const taskInput = document.querySelector('.task-input');


todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = taskInput.value;
    taskInput.value = '';
    fetch('/todo.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const container = document.querySelector('.cont1');
            const newDiv = document.createElement('div');
            const completeIcon = document.createElement('i');
            const editIcon = document.createElement('i');
            const eventIcon = document.createElement('i');
            const deleteIcon = document.createElement('i');
            const iconsDiv = document.createElement('div');
            const outerDiv = document.createElement('div');

            newDiv.className = 'todo-item';
            deleteIcon.className = 'fa-solid fa-trash fa-2xl';
            eventIcon.className = 'fa-solid fa-calendar-days fa-2xl';
            editIcon.className = 'fa-solid fa-pen-to-square fa-2xl';
            completeIcon.className = 'fas fa-regular fa-circle-check fa-2xl';
            completeIcon.style.color = '#FF69B4';
            deleteIcon.style.color = '#FF69B4';
            eventIcon.style.color = '#FF69B4';
            editIcon.style.color = '#FF69B4';

            newDiv.style.display = 'inline-block';
            newDiv.style.marginLeft = '20px';
            newDiv.style.border = '5px solid #FF69B4';
            newDiv.style.borderRadius = '30px';
            newDiv.textalign = 'center';
            newDiv.style.display = 'flex';
            newDiv.style.flexDirection = 'column';
            newDiv.style.justifyContent = 'center';
            newDiv.style.textAlign = 'center';
            newDiv.style.width = '300px';
            newDiv.style.padding = '10px';
            newDiv.style.marginTop = '5px';
            newDiv.style.marginLeft = '350px';
            newDiv.style.height = '50px';
            newDiv.style.backgroundColor = 'white';
            newDiv.style.color = 'balck';
            newDiv.style.fontSize = '25px';
            newDiv.style.fontWeight = '';
            newDiv.textContent = data.task;


            outerDiv.style.display = 'flex';
            outerDiv.style.marginLeft = '50px';

            completeIcon.style.paddingLeft = '10px';
            eventIcon.style.paddingLeft = '10px';
            editIcon.style.paddingLeft = '10px';
            deleteIcon.style.paddingLeft = '10px';

            iconsDiv.style.display = 'flex';
            iconsDiv.style.justifyContent = 'center';
            iconsDiv.style.alignItems = 'center';

            outerDiv.appendChild(newDiv);
            outerDiv.appendChild(iconsDiv);
            container.appendChild(outerDiv);
            iconsDiv.appendChild(deleteIcon);
            iconsDiv.appendChild(editIcon);
            iconsDiv.appendChild(eventIcon);
            iconsDiv.appendChild(completeIcon);

            completeIcon.addEventListener('click', (event) => {
                event.preventDefault();
                newDiv.style.textDecoration = 'line-through';
                newDiv.style.color = 'white';
                newDiv.style.backgroundColor = '#FF69B4';
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
            });

            editIcon.addEventListener('click', (event) => {
                event.preventDefault();
                alert('Edit');
            });

            deleteIcon.addEventListener('click', (event) => {
                event.preventDefault();
                newDiv.remove();
                iconsDiv.remove();
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

