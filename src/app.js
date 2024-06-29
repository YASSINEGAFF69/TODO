document.addEventListener('DOMContentLoaded', () => {
    const projectsListContainer = document.getElementById('projectsListContainer');
    const todosListContainer = document.getElementById('todosListContainer');
    const todosListTitle = document.getElementById('todosListTitle');
    const editFormContainer = document.getElementById('editFormContainer');
    const newProjectTitleInput = document.getElementById('newProjectTitle');
    const newTodoTitleInput = document.getElementById('newTodoTitle');
    const itemTitle = document.getElementById('itemTitle');
    let currentProjectID = null;
    let currentItem = null;
    let projectsData = [];

    function renderProjects() {
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = ''; // Clear existing list
        projectsData.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.title;
            li.setAttribute('data-project-id', project.id);
            li.classList.add('project-item');
            projectsList.appendChild(li);
        });
    }

    function renderTodos(projectID) {
        const project = projectsData.find(proj => proj.id === projectID);
        todosListTitle.textContent = project.title + " Todos";
        const todosList = document.getElementById('todosList');
        todosList.innerHTML = ''; // Clear existing list
        project.todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.title;
            li.setAttribute('data-todo-id', todo.id);
            li.classList.add('todo-item');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('todo-checkbox');
            li.prepend(checkbox);
            todosList.appendChild(li);
        });
    }

    // Event delegation for project item clicks
    projectsListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('project-item')) {
            const projectID = event.target.getAttribute('data-project-id');
            currentProjectID = projectID;
            renderTodos(projectID);
            todosListContainer.classList.remove('hidden');
            projectsListContainer.classList.add('hidden');
        }
    });

    // Event delegation for todo item clicks
    todosListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('todo-item')) {
            const todoID = event.target.getAttribute('data-todo-id');
            currentItem = { projectID: currentProjectID, todoID };
            const todo = projectsData.find(proj => proj.id === currentItem.projectID).todos.find(todo => todo.id === currentItem.todoID);
            itemTitle.value = todo.title;
            editFormContainer.classList.remove('hidden');
            todosListContainer.classList.add('hidden');
        }
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        if (currentItem) {
            const todo = projectsData.find(proj => proj.id === currentItem.projectID).todos.find(todo => todo.id === currentItem.todoID);
            todo.title = itemTitle.value;
            renderTodos(currentItem.projectID);
            editFormContainer.classList.add('hidden');
            todosListContainer.classList.remove('hidden');
        }
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        editFormContainer.classList.add('hidden');
        todosListContainer.classList.remove('hidden');
    });

    document.getElementById('addProjectButton').addEventListener('click', () => {
        const newTitle = newProjectTitleInput.value.trim();
        if (newTitle !== '') {
            const newProject = { id: 'project' + (projectsData.length + 1), title: newTitle, todos: [] };
            projectsData.push(newProject);
            newProjectTitleInput.value = '';
            renderProjects();
        }
    });

    document.getElementById('addTodoButton').addEventListener('click', () => {
        const newTitle = newTodoTitleInput.value.trim();
        if (newTitle !== '') {
            const project = projectsData.find(proj => proj.id === currentProjectID);
            const newTodo = { id: 'todo' + (project.todos.length + 1), title: newTitle };
            project.todos.push(newTodo);
            newTodoTitleInput.value = '';
            renderTodos(currentProjectID);
        }
    });

    document.getElementById('cancelButton2').addEventListener('click', () => {
        todosListContainer.classList.add('hidden');
        projectsListContainer.classList.remove('hidden');
    });

    // Add event listeners for Enter key press on inputs
    newProjectTitleInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('addProjectButton').click();
        }
    });

    newTodoTitleInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('addTodoButton').click();
        }
    });

    itemTitle.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('saveButton').click();
        }
    });

    renderProjects(); // Initial rendering of projects
});
