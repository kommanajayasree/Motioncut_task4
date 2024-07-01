document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const uncompletedTaskList = document.getElementById('uncompleted-task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const yearSpan = document.getElementById('year');
  
    // Set the current year in the footer
    yearSpan.textContent = new Date().getFullYear();
  
    // Load tasks from local storage
    loadTasks();
  
    // Add task event
    addTaskButton.addEventListener('click', addTask);
  
    // Add task function
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText) {
        const task = {
          text: taskText,
          completed: false,
        };
        addTaskToDOM(task);
        saveTask(task);
        taskInput.value = '';
      }
    }
  
    // Add task to DOM
    function addTaskToDOM(task) {
      const li = document.createElement('li');
      li.textContent = task.text;
      li.classList.toggle('completed', task.completed);
  
      const editButton = createButton('Edit', 'edit', () => editTask(li));
      const deleteButton = createButton('Delete', 'delete', () => deleteTask(li));
      const toggleButton = createButton(
        task.completed ? 'Uncomplete' : 'Complete',
        task.completed ? 'uncomplete' : 'complete',
        () => toggleTaskCompletion(li)
      );
  
      li.appendChild(toggleButton);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
  
      if (task.completed) {
        completedTaskList.appendChild(li);
      } else {
        uncompletedTaskList.appendChild(li);
      }
    }
  
    // Create button
    function createButton(text, className, onClick) {
      const button = document.createElement('button');
      button.textContent = text;
      button.className = className;
      button.addEventListener('click', onClick);
      return button;
    }
  
    // Edit task
    function editTask(li) {
      const originalText = li.firstChild.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalText;
  
      const saveButton = createButton('Save', 'save', () => {
        li.firstChild.textContent = input.value;
        updateTaskInLocalStorage(originalText, input.value);
        li.replaceChild(document.createTextNode(input.value), input);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(toggleButton);
      });
  
      const cancelButton = createButton('Cancel', 'cancel', () => {
        li.replaceChild(document.createTextNode(originalText), input);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(toggleButton);
      });
  
      const editButton = createButton('Edit', 'edit', () => editTask(li));
      const deleteButton = createButton('Delete', 'delete', () => deleteTask(li));
      const toggleButton = createButton(
        li.classList.contains('completed') ? 'Uncomplete' : 'Complete',
        li.classList.contains('completed') ? 'uncomplete' : 'complete',
        () => toggleTaskCompletion(li)
      );
  
      li.innerHTML = '';
      li.appendChild(input);
      li.appendChild(saveButton);
      li.appendChild(cancelButton);
    }
  
    // Delete task
    function deleteTask(li) {
      if (li.classList.contains('completed')) {
        completedTaskList.removeChild(li);
      } else {
        uncompletedTaskList.removeChild(li);
      }
      removeTaskFromLocalStorage(li.firstChild.textContent);
    }
  
    // Toggle task completion
    function toggleTaskCompletion(li) {
      li.classList.toggle('completed');
      if (li.classList.contains('completed')) {
        li.lastChild.textContent = 'Uncomplete';
        completedTaskList.appendChild(li);
      } else {
        li.lastChild.textContent = 'Complete';
        uncompletedTaskList.appendChild(li);
      }
      updateTaskCompletionInLocalStorage(li.firstChild.textContent);
    }
  
    // Save task to local storage
    function saveTask(task) {
      const tasks = getTasksFromLocalStorage();
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Load tasks from local storage
    function loadTasks() {
      const tasks = getTasksFromLocalStorage();
      tasks.forEach((task) => addTaskToDOM(task));
    }
  
    // Get tasks from local storage
    function getTasksFromLocalStorage() {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  
    // Update task in local storage
    function updateTaskInLocalStorage(oldText, newText) {
      const tasks = getTasksFromLocalStorage();
      const task = tasks.find((task) => task.text === oldText);
      if (task) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  
    // Remove task from local storage
    function removeTaskFromLocalStorage(text) {
      let tasks = getTasksFromLocalStorage();
      tasks = tasks.filter((task) => task.text !== text);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Update task completion in local storage
    function updateTaskCompletionInLocalStorage(text) {
      const tasks = getTasksFromLocalStorage();
      const task = tasks.find((task) => task.text === text);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  });
  