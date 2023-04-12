const logout = document.querySelectorAll('.logout');
const newDiv = document.querySelectorAll('.todo-item');
const deleteIcons = document.querySelectorAll('.fa-solid.fa-trash.fa-2xl');
const iconsDiv = document.querySelectorAll('.icons');
const Add = document.querySelectorAll('.add');
const editIcons = document.querySelectorAll('.fa-solid.fa-calendar-days.fa-2xl');
const completeIcons = document.querySelectorAll('.fas.fa-regular.fa-circle-check.fa-2xl');
const task = document.querySelectorAll('.task-input');

Add.forEach((add, index) => {
    add.addEventListener('click', (event) => {
        event.preventDefault();
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
        newDiv.style.marginLeft = '280px';
        newDiv.style.height = '50px';
        newDiv.style.backgroundColor = 'white';
        newDiv.style.color = 'balck';
        newDiv.style.fontSize = '25px';
        newDiv.style.fontWeight = '';
        newDiv.textContent = task[index].value;

        outerDiv.style.display = 'flex';
        outerDiv.style.marginLeft = '125px';

        deleteIcon.style.paddingLeft = '10px';
        completeIcon.style.paddingLeft = '10px';
        eventIcon.style.paddingLeft = '10px';
        editIcon.style.paddingLeft = '10px';

        iconsDiv.style.display = 'flex';
        iconsDiv.style.justifyContent = 'center';
        iconsDiv.style.alignItems = 'center';

        outerDiv.appendChild(newDiv);
        outerDiv.appendChild(iconsDiv);
        container.appendChild(outerDiv);
        iconsDiv.appendChild(completeIcon);
        iconsDiv.appendChild(eventIcon);
        iconsDiv.appendChild(editIcon);
        iconsDiv.appendChild(deleteIcon);
    })
});
completeIcons.forEach((completeIcon, index) => {
    completeIcon.addEventListener('click', (event) => {
        event.preventDefault();
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
    });
});

editIcons.forEach((editIcon, index) => {
    editIcon.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Edit');
    });
});

deleteIcons.forEach((deleteIcon, index) => {
    deleteIcon.addEventListener('click', (event) => {
        event.preventDefault();
        newDiv[index].remove();
        iconsDiv[index].remove();
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
