const todoForm = document.querySelector('.todo-form');
const Add = document.querySelector('.add');
const taskInput = document.querySelector('.task-input');
const logout = document.querySelector('.logout');
const emailBorder = document.querySelector('.i1');
const passwordBorder = document.querySelector('.i2');
const form = document.querySelector('.form-item');

todoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const task = taskInput.value.trim();
    if (!task) {
        return;
    }
    const token = getCookie('token');
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ task })
        });

        const todo = await response.json();

        const container = document.querySelector('.cont1');
        const newDiv = document.createElement('div');
        const completeIcon = document.createElement('i');
        const editIcon = document.createElement('i');
        const eventIcon = document.createElement('i');
        const deleteIcon = document.createElement('i');
        const iconsDiv = document.createElement('div');
        const outerDiv = document.createElement('div');
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

    } catch (error) {
        console.log(error);
    }
});


logout.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            console.log(response); // Check response content
            console.log('redirecting to login...');
            window.location.href = '/login';
        })
        .catch(err => {
            console.log(err);
        });
});
