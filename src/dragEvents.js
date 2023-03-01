let list, task, tasks, cloneTask, halfHeight, gap, closestTask, tag;

function start(e) {
  list = e.currentTarget;
  task = e.target;
  tag = task.tagName;
  if (tag === "IMG" || tag === "BUTTON") return;
  if (tag !== "LI") task = e.target.parentElement;
  halfHeight = task.getBoundingClientRect().height / 2;
  cloneTask = task.cloneNode(true);
  gap = e.pageX - list.offsetLeft;
  cloneTask.classList.add("dragging-c");
  task.classList.add("dragging");
  cloneTask.style.top = `${e.pageY - list.offsetTop - halfHeight}px`;
  list.appendChild(cloneTask);

  list.addEventListener("pointermove", over);
  list.addEventListener("pointerup", end);
}

function over(e) {
  e.preventDefault();
  tasks = [...document.querySelectorAll(".task:not(.dragging-c)")];
  if (cloneTask) {
    const Before = beforeTask(e.clientY, tasks);
    cloneTask.style.top = `${e.pageY - list.offsetTop - halfHeight}px`;
    cloneTask.style.left = `${e.pageX - list.offsetLeft - gap}px`;
    tasks.forEach((task) => {
      task.classList.remove("over");
    });
    if (Before.element) Before.element.classList.add("over");
    closestTask = Before.element;
  }
}

function end() {
  if (tag === "IMG" || tag === "BUTTON") return;
  const storage = localStorage;
  const title = document.querySelector(".over .task__title").textContent;
  const dragIdx = tasks.indexOf(task);
  let data = JSON.parse(storage.getItem("tasks"));
  let stash = data[dragIdx];
  data.splice(dragIdx, 1);
  const overIdx = data.findIndex((task) => task.title === title);
  data.splice(overIdx, 0, stash);
  console.log(data);
  if (closestTask) {
    closestTask.classList.remove("over");
    list.insertBefore(task, closestTask);
  } else {
    list.appendChild(task);
  }
  task.classList.remove("dragging");
  cloneTask.remove();
  list.removeEventListener("pointermove", over);
  storage.setItem("tasks", JSON.stringify(data));
}

function beforeTask(posit, tasks) {
  return tasks.reduce(
    (closest, task) => {
      const Rect = task.getBoundingClientRect();
      const checkPositTast = Rect.top <= posit && posit <= Rect.bottom;
      const checkPositNext =
        Rect.top <= posit && posit <= Rect.top + Rect.height / 2;
      return {
        element: checkPositTast ? task : closest.element,
        before: checkPositNext ? true : closest.before,
      };
    },
    { element: undefined, before: false }
  );
}

export { start };
