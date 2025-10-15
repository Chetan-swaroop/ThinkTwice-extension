// --- Code that runs as soon as the popup opens ---

// Find the buttons and inputs in the HTML so we can use them
const addTaskButton = document.getElementById('addTaskBtn');
const optionsButton = document.getElementById('optionsBtn');

// When the "Add Task" button is clicked, run the 'addNewTask' function
addTaskButton.onclick = addNewTask;

// When the "Configure" button is clicked, open the settings page
optionsButton.onclick = function() {
  chrome.runtime.openOptionsPage();
};

// Immediately show any tasks that are already saved
showAllTasks();


// --- All the functions that do the real work ---

/**
 * Gets all tasks from Chrome's storage and displays them in the list.
 */
function showAllTasks() {
  // Ask Chrome for the saved list of 'tasks'
  chrome.storage.local.get(['tasks'], function(result) {
    const tasks = result.tasks || []; // If no tasks are saved, use an empty list
    const taskListElement = document.getElementById('taskList');

    // Clear out the old list before adding the new one
    taskListElement.innerHTML = '';

    // If there are no tasks, show a friendly message
    if (tasks.length === 0) {
      taskListElement.innerHTML = '<li style="color: #7f8c8d; padding: 10px;">No tasks yet. Add one above!</li>';
      return; // Stop the function here
    }

    // Loop through each task in the list, one by one
    for (let i = 0; i < tasks.length; i++) {
      const currentTask = tasks[i];

      // Create a new HTML list item (<li>) for this task
      const li = document.createElement('li');
      li.className = `task-item ${currentTask.priority.toLowerCase()}`;

      // Set the HTML content for the new list item
      li.innerHTML = `
        <div>
          <div class="task-name">${currentTask.name}</div>
          ${currentTask.link ? `<small style="color: #7f8c8d;">📎 Has link</small>` : ''}
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="task-priority">${currentTask.priority}</span>
          <button class="btn btn-delete">Delete</button>
        </div>
      `;

      // Find the delete button we just created
      const deleteButton = li.querySelector('.btn-delete');
      // Tell the button to run 'deleteThisTask' when clicked, and pass it the task's unique ID
      deleteButton.onclick = function() {
        deleteThisTask(currentTask.id);
      };

      // Add the fully built list item to the page
      taskListElement.appendChild(li);
    }
  });
}

/**
 * Gathers the info from the input fields and adds a new task.
 */
function addNewTask() {
  // Get the values from the input boxes
  const taskNameInput = document.getElementById('taskName');
  const taskLinkInput = document.getElementById('taskLink');
  const taskPrioritySelect = document.getElementById('taskPriority');

  const newTaskName = taskNameInput.value;
  const newTaskLink = taskLinkInput.value;
  const newTaskPriority = taskPrioritySelect.value;

  // Make sure the user actually typed a name
  if (newTaskName.trim() === '') {
    alert('Please enter a task name.');
    return; // Stop the function
  }

  // First, get the current list of tasks
  chrome.storage.local.get(['tasks'], function(result) {
    const tasks = result.tasks || [];

    // Create a new task object
    const taskToAdd = {
      id: Date.now(), // Use the current time as a simple unique ID
      name: newTaskName,
      link: newTaskLink,
      priority: newTaskPriority
    };

    // Add the new task to the list
    tasks.push(taskToAdd);

    // Save the newly updated list back to Chrome's storage
    chrome.storage.local.set({ tasks: tasks }, function() {
      // Clear the input fields for the next task
      taskNameInput.value = '';
      taskLinkInput.value = '';
      taskPrioritySelect.value = 'Medium';
      // Refresh the list on the page
      showAllTasks();
    });
  });
}

/**
 * Deletes a task based on its unique ID.
 */
function deleteThisTask(taskIdToDelete) {
  chrome.storage.local.get(['tasks'], function(result) {
    const allTasks = result.tasks || [];
    
    // Create a new, empty list to hold the tasks we want to keep
    const tasksToKeep = [];

    // Loop through all the tasks
    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      // If the current task's ID does NOT match the one we want to delete...
      if (task.id !== taskIdToDelete) {
        // ...then add it to our list of tasks to keep.
        tasksToKeep.push(task);
      }
    }

    // Save the new list (which no longer has the deleted task)
    chrome.storage.local.set({ tasks: tasksToKeep }, function() {
      // Refresh the list on the page
      showAllTasks();
    });
  });
}