document.addEventListener('DOMContentLoaded', () => {
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task-button');
    const columns = document.querySelectorAll('.column-cards'); // As áreas onde os cards são dropados

    const COLUMN_IDS = {
        OPEN: 'open',
        BID: 'bid',
        PROGRESS: 'progress',
        DONE: 'done'
    };

    let tasks = []; // Array para armazenar todas as tarefas
    let draggedTask = null; // Para armazenar a tarefa sendo arrastada

    // Carregar tarefas do localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('kanbanTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // Salvar tarefas no localStorage
    function saveTasks() {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }

    // Renderizar todas as tarefas nas colunas corretas
    function renderTasks() {
        // Limpar colunas antes de renderizar
        columns.forEach(column => column.innerHTML = '');

        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            const targetColumn = document.querySelector(`.column-cards[data-column-id="${task.column}"]`);
            if (targetColumn) {
                targetColumn.appendChild(taskCard);
            }
        });
    }

    // Criar o elemento HTML do card da tarefa
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.setAttribute('draggable', true);
        card.dataset.taskId = task.id;
        card.dataset.column = task.column; // Adiciona a coluna atual ao card

        const description = document.createElement('p');
        description.textContent = task.description;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-task-button');
        removeButton.innerHTML = '&times;'; // Caractere 'X'
        removeButton.addEventListener('click', () => removeTask(task.id));

        card.appendChild(description);
        card.appendChild(removeButton);

        // Eventos de Drag and Drop para o card
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        return card;
    }

    // Adicionar uma nova tarefa
    addTaskButton.addEventListener('click', () => {
        const description = taskDescriptionInput.value.trim();
        if (description) {
            const newTask = {
                id: `task-${Date.now()}`, // ID único para a tarefa
                description: description,
                column: COLUMN_IDS.OPEN // Nova tarefa sempre vai para "Em aberto"
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks(); // Re-renderiza para adicionar o novo card
            taskDescriptionInput.value = ''; // Limpa o input
        } else {
            alert("Por favor, insira uma descrição para a tarefa.");
        }
    });

    // Remover uma tarefa
    function removeTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    // --- Lógica de Drag and Drop ---
    function handleDragStart(e) {
        draggedTask = this; // 'this' é o card sendo arrastado
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.taskId); // Envia o ID da tarefa
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedTask = null;
    }

    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });

    function handleDragOver(e) {
        e.preventDefault(); // Necessário para permitir o drop
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (this.classList.contains('column-cards')) { // 'this' é a div .column-cards
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave() {
        if (this.classList.contains('column-cards')) {
            this.classList.remove('drag-over');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        if (this.classList.contains('column-cards')) {
            this.classList.remove('drag-over');
            const targetColumnId = this.dataset.columnId;
            const taskId = e.dataTransfer.getData('text/plain');
            
            // Encontrar a tarefa e atualizar sua coluna
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].column = targetColumnId;
                saveTasks();
                renderTasks(); // Re-renderiza tudo para refletir a mudança
            }
        }
    }

    // Inicialização
    loadTasks();
});