import { useEffect, useState } from "react";
import TasksCreature from "./component/TasksCreature";
import { start } from "./dragEvents";

function App() {
  const storage = localStorage;
  const data = JSON.parse(storage.getItem("tasks"));
  const [filter, setFilter] = useState(true);
  const [Data, setData] = useState([]);

  useEffect(() => {
    const body = document.body;
    if (storage.length) setData(JSON.parse(storage.getItem("tasks")));
    setFilter(body.clientWidth >= 768 ? false : true);
    window.addEventListener("resize", () => {
      setFilter(body.clientWidth >= 768 ? false : true);
    });
  }, []);

  const storeData = (data) => {
    setData(data);
    storage.setItem("tasks", JSON.stringify(data));
  };
  const handleTheme = () => document.body.classList.toggle("light");

  const handleSubmit = (e, task) => {
    e.preventDefault();
    let check = Data.some((tsk) => tsk.title === task.title);
    if (!task.title || check) return;
    Data.unshift(task);
    storeData([...Data]);
  };
  const handleDelete = (e) => {
    const curId = e.currentTarget.parentElement.getAttribute("data-item");
    let newTasksList = Data.filter((task) => task.id !== curId);
    storeData(newTasksList);
  };
  const handleState = (e) => {
    const curId = e.currentTarget.parentElement.getAttribute("data-item");
    let newTasksList = Data.map((task) => {
      if (task.id === curId) task.state = !task.state;
      return task;
    });
    storeData(newTasksList);
  };
  const handleFilter = (e) => {
    const filter = e.currentTarget.textContent;
    let taskList;
    switch (filter) {
      case "Active":
        taskList = data.filter((task) => !task.state);
        break;
      case "Completed":
        taskList = data.filter((task) => task.state);
        break;
      default:
        taskList = data;
    }
    setData(taskList);
  };

  const clearTasks = () => {
    const filterData = data.filter((task) => !task.state);
    storeData(filterData);
  };
  return (
    <div className="App">
      <div className="container">
        <header>
          <h1 className="todo__title">Todo</h1>
          <button className="todo__theme__btn" onClick={handleTheme}>
            <img
              src="./images/icon-sun.svg"
              alt="light theme"
              className="todo__theme--light"
            />
            <img
              src="./images/icon-moon.svg"
              alt="dark theme"
              className="todo__theme--dark"
            />
          </button>
        </header>
        <div className="task__container">
          <TasksCreature submit={handleSubmit} data={Data} />
          <div className="inner__container">
            <ul className="tasks__list" onPointerDown={start}>
              {Data &&
                Data.map((task) => {
                  return (
                    <li className="task" key={task.id} data-item={task.id}>
                      <button
                        className={`task__state ${
                          task.state ? "completed" : ""
                        }`}
                        onClick={handleState}
                      >
                        <img
                          src="./images/icon-check.svg"
                          className="task__check"
                        />
                      </button>
                      <h2 className="task__title">{task.title}</h2>
                      <button className="task__delete" onClick={handleDelete}>
                        <img src="./images/icon-cross.svg" />
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="task__filter">
              <p className="length__items">{Data.length} item left</p>
              {!filter && (
                <ul className="filter__btns">
                  <li>
                    <button className="filter__btn" onClick={handleFilter}>
                      All
                    </button>
                  </li>
                  <li>
                    <button className="filter__btn" onClick={handleFilter}>
                      Active
                    </button>
                  </li>
                  <li>
                    <button className="filter__btn" onClick={handleFilter}>
                      Completed
                    </button>
                  </li>
                </ul>
              )}
              <button className="clear__btn" onClick={clearTasks}>
                Clear Completed
              </button>
            </div>
          </div>
          {filter && (
            <ul className="filter__btns__outer">
              <li>
                <button className="filter__btn" onClick={handleFilter}>
                  All
                </button>
              </li>
              <li>
                <button className="filter__btn" onClick={handleFilter}>
                  Active
                </button>
              </li>
              <li>
                <button className="filter__btn" onClick={handleFilter}>
                  Completed
                </button>
              </li>
            </ul>
          )}
        </div>
        <p className="drag__text">Drag and drop to reorder list</p>
      </div>
      <div className="bg">
        <div className="bg__light">
          <img
            src="./images/bg-desktop-light.jpg"
            className="bg__light--desk"
          />
          <img src="./images/bg-mobile-light.jpg" className="bg__light--mob" />
        </div>
        <div className="bg__dark">
          <img src="./images/bg-desktop-dark.jpg" className="bg__dark--desk" />
          <img src="./images/bg-mobile-dark.jpg" className="bg__dark--mob" />
        </div>
      </div>
    </div>
  );
}

export default App;
