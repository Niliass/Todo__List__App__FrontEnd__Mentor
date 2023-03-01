import React, { useState } from "react";

const TasksCreature = ({ submit, data }) => {
  const [state, setState] = useState(false);
  const [task, setTask] = useState("");
  const idGenerators = () => {
    let chrs = "ABCDEFGHIKLMNOPQRSTVXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let id = "";
    while (id.length < 5) {
      id += chrs[Math.floor(Math.random() * chrs.length)];
    }
    let check = data.every((task) => task.id !== id);
    return check ? id : idGenerators();
  };
  const taskObj = {
    id: idGenerators(),
    title: task,
    state: state,
  };
  return (
    <form
      action=""
      className="task__form"
      onSubmit={(e) => {
        submit(e, taskObj);
        setTask("");
        setState(false);
      }}
    >
      <div
        className={`task__state ${state ? "completed" : ""}`}
        role={"button"}
        onClick={() => setState(!state)}
      >
        <img src="./images/icon-check.svg" className="task__check" />
      </div>
      <input
        type="text"
        name="task"
        placeholder="Create a new todo..."
        value={task}
        onChange={(e) => setTask(e.currentTarget.value)}
      />
    </form>
  );
};

export default TasksCreature;
