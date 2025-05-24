let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {

        tasks.push({ text: taskText });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        updateTaskList();
        
        taskInput.value = '';
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    
    localStorage.setItem('tasks', JSON.stringify(tasks));

    updateTaskList();
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.className = 'deleteButton';
        deleteButton.onclick = () => deleteTask(index);
        
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}
window.onload = updateTaskList;