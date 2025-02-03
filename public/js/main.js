const submit = async function(event) {
    event.preventDefault();

    const taskInput = document.querySelector("#task").value;
    const priorityInput = document.querySelector("#priority").value;
    const infoInput = document.querySelector("#info").value;
    const dateInput = document.querySelector("#date").value;

    const taskData = {
        task: taskInput,
        priority: priorityInput,
        info: infoInput,
        date: dateInput
    };

    const body = JSON.stringify(taskData);

    const response = await fetch("/submit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });

    const tasks = await response.json();
    updateTaskTable(tasks);
}

const updateTaskTable = (tasks) => {
    const taskTableBody = document.querySelector("#taskTableBody");
    taskTableBody.innerHTML = "";
    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        const taskCell = document.createElement("td");
        taskCell.textContent = task.task;
        row.appendChild(taskCell);

        const infoCell = document.createElement("td");
        infoCell.textContent = task.info;
        row.appendChild(infoCell);

        const priorityCell = document.createElement("td");
        priorityCell.textContent = task.priority;
        row.appendChild(priorityCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = task.date;
        row.appendChild(dateCell);

        // Add Edit Button
        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editTask(index, task);
        editCell.appendChild(editButton);
        row.appendChild(editCell);

        // Add Delete Button
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(index);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        taskTableBody.appendChild(row);
    });
}

const editTask = (index, task) => {
    // Show the Edit Task form on the right
    document.querySelector("#editTask").style.display = "block";

    // Fill the form with existing task data
    document.querySelector("#editTaskName").value = task.task;
    document.querySelector("#editPriority").value = task.priority;
    document.querySelector("#editInfo").value = task.info;
    document.querySelector("#editDate").value = task.date;
    document.querySelector("#editIndex").value = index;
}

const cancelEdit = () => {
    // Hide the Edit Task form and return to Create Task
    document.querySelector("#editTask").style.display = "none";
}

const saveEdit = async function(event) {
    event.preventDefault();

    const index = document.querySelector("#editIndex").value;
    const taskInput = document.querySelector("#editTaskName").value;
    const priorityInput = document.querySelector("#editPriority").value;
    const infoInput = document.querySelector("#editInfo").value;
    const dateInput = document.querySelector("#editDate").value;

    const updatedTask = {
        task: taskInput,
        priority: priorityInput,
        info: infoInput,
        date: dateInput
    };

    const response = await fetch(`/edit/${index}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    const tasks = await response.json();
    updateTaskTable(tasks);

    // Hide Edit form after saving
    cancelEdit();
}

const deleteTask = async (index) => {
    const response = await fetch(`/delete/${index}`, {
        method: 'DELETE'
    });

    const tasks = await response.json();
    updateTaskTable(tasks);
}

window.onload = function() {
    const form = document.querySelector("#listForm");
    form.onsubmit = submit;

    const editForm = document.querySelector("#editForm");
    editForm.onsubmit = saveEdit;
}
