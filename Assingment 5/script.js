// ---------------- SELECTORS ----------------
const form = document.querySelector("form");
const taskName = document.querySelector(".inp1");
const date = document.querySelector("#date");
const taskBoard = document.querySelector(".task-board");
const submitBtn = document.querySelector("#btn1");
const themeToggleBtn = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");
const resetBtn = document.querySelector("#resetBtn");

// reset button logic

resetBtn.addEventListener("click", () => {

  if (tasksData.length === 0) {
    alert("No tasks to delete!");
    return;
  }

  const confirmReset = confirm("Delete all tasks?");

  if (!confirmReset) return;

  tasksData = [];

  localStorage.removeItem("tasks");

  renderTasks();

});

// dark theme logic

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  if (themeToggleBtn) {
    themeToggleBtn.className = "ri-sun-line";
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggleBtn.className = "ri-sun-line"; 
    } else {
      localStorage.setItem("theme", "light"); // Light mode save kiya
      themeToggleBtn.className = "ri-moon-line";
    }
  });
}

// ---------------- STATE ----------------

let tasksData = JSON.parse(localStorage.getItem("tasks")) || [];

let editingTaskId = null;

let currentFilter = "all";

// ---------------- LOCAL STORAGE ----------------

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ---------------- RENDER TASKS ----------------

function renderTasks(filter = "all") {
  taskBoard.innerHTML = "";

  let filteredTasks = tasksData;

  if (filter === "completed") {
    filteredTasks = tasksData.filter((task) => task.completed);
  }

  if (filter === "pending") {
    filteredTasks = tasksData.filter((task) => !task.completed);
  }

  filteredTasks.forEach((task) => {
    taskBoard.innerHTML += `

    <div class="tasks" data-id="${task.id}">

      <div class="task-info">

        <h2>${task.title}</h2>

        <div class="time">

          <i class="ri-calendar-line"
          style="color:#9b9b9c;"></i>

          <p style="color:#9b9b9c;">
            ${task.date}
          </p>

        </div>
      </div>

      <div class="btns">

  ${
    task.completed
      ? `<p class="completed-msg">
         Task Completed ✔
       </p>`
      : `
      <button class="edit">Edit</button>

      <button class="delete">Delete</button>

      <button class="complete">Complete</button>
    `
  }

</div>

    </div>

    `;
  });
}

// ---------------- FORM SUBMIT ----------------

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskValue = taskName.value.trim();

  const dateValue = date.value;

  if (!taskValue || !dateValue) return;

  // UPDATE MODE

  if (editingTaskId !== null) {
    const task = tasksData.find((task) => task.id === editingTaskId);

    task.title = taskValue;

    task.date = dateValue;

    editingTaskId = null;

    submitBtn.textContent = "Add Task";
  }

  // ADD MODE
  else {
    tasksData.push({
      id: Date.now(),

      title: taskValue,

      date: dateValue,

      completed: false,
    });
  }

  saveToLocalStorage();

  renderTasks(currentFilter);

  form.reset();
});

// ---------------- EVENT DELEGATION ----------------

taskBoard.addEventListener("click", (e) => {
  const taskEl = e.target.closest(".tasks");

  if (!taskEl) return;

  const id = Number(taskEl.dataset.id);

  // DELETE

  if (e.target.classList.contains("delete")) {
    tasksData = tasksData.filter((task) => task.id !== id);
  }

  // COMPLETE

  if (e.target.classList.contains("complete")) {
    const task = tasksData.find((task) => task.id === id);

    task.completed = !task.completed;
  }

  // EDIT

  if (e.target.classList.contains("edit")) {
    const task = tasksData.find((task) => task.id === id);

    taskName.value = task.title;

    date.value = task.date;

    editingTaskId = id;

    submitBtn.textContent = "Update Now";
  }

  saveToLocalStorage();

  renderTasks(currentFilter);
});

// ---------------- FILTER ----------------

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    // 1. Pehle global state variable ko update karein naye filter se
    currentFilter = btn.dataset.filter; 
    
    // 2. Ab updated filter ke saath tasks ko render karein
    renderTasks(currentFilter);
  });
});

// ---------------- INITIAL LOAD ----------------
renderTasks(currentFilter);
