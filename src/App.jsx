import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [newTask, setNewTask] = useState("");

  const [tasks, setTasks] = useState( () => {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks){
      return [];
    }

    return JSON.parse(savedTasks).map((task) => ({
      ...task, createdAt: new Date(task.createdAt)
    })

    );
  }

  );

  const [doneTasks, setDoneTasks] = useState(() => {
    const savedDoneTasks = localStorage.getItem("doneTasks");

    if (!savedDoneTasks) {
      return [];
    }

    return JSON.parse(savedDoneTasks).map((task) => ({
      ...task, createdAt: new Date(task.createdAt)
    }));
  });

  const [priority, setPriority] = useState("Medium");

  const priorityValues = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  const sortedTasks = [...tasks].sort((a,b) => {
    const priorityMath = priorityValues[b.priority] - priorityValues[a.priority];

    if (priorityMath !== 0){
      return priorityMath;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  })

  const [filter, setFilter] = useState("toDoTasks");
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }, [doneTasks]);


  function submitTask(event){
    event.preventDefault();

    if (newTask.trim() === ""){
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask,
      createdAt: new Date(),
      priority: priority,
      isDone: false
    };

    setTasks([...tasks, task]);
    setNewTask("");

  }

  function toggleTaskDone(taskId){
    const taskToMove = tasks.find((task) => task.id === taskId);

    if (!taskToMove){
      return;
    }

    setTasks(tasks.filter((task) => task.id !== taskId));

    setDoneTasks([
      ...doneTasks, {...taskToMove, isDone: true}
    ]);
  }

  function toggletaskUndone(taskId){
    const taskToMove = doneTasks.find((task) => task.id === taskId);

    if (!taskToMove){
      return;
    }

    setDoneTasks(doneTasks.filter((task) => task.id !== taskId));

    setTasks([
      ...tasks, {...taskToMove, isDone: false}
    ]);
  }
  
  return (
    <>
      <header>
        <div className="headerTop" >
          <p className="descriptionClass"><span className="emojiClass">&#128198;</span> Personal planner</p>
          <div className="darkToggle">
            <input type="checkbox" id="dark-mode-toggle"/>
            <label htmlFor="dark-mode-toggle" className="toggle"></label>
          </div>
        </div>
        <h1>TO DO TASK TRACKER</h1>
        <p>Manage your tasks as you wish</p>
      </header>

      <main>
        <div className="container">
          <p>Enter your task</p>

          <form className="taskInput" onSubmit={submitTask}>
            <input type="text" name="taskInput" value={newTask} onChange={(event) => setNewTask(event.target.value)} />
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option style={{color: "blue"}} value="Low">Low</option>
              <option style={{color: "orange"}} value="Medium">Medium</option>
              <option style={{color: "red"}} value="High">High</option>
            </select>
            <button type="submit">+</button>
          </form>

          <div className="buttons">
            <button onClick={() => setFilter("toDoTasks")}>See planned tasks</button>
            <button onClick={() => setFilter("done")}>See done tasks</button>
            <button onClick={() => setFilter("sorted")} className='sortButton'>☷  Sort </button>
          </div>
          <div className="taskList">
            {filter === "toDoTasks" && (
            <>
              {tasks.map((task) => (
                <div className={task.isDone ? "taskDone" : "task"} key={task.id}>
                <input type="checkbox" checked={task.isDone} onChange={() => toggleTaskDone(task.id)} className={task.isDone ? "doneCheckBox" : ""} />
                <span className={task.isdone ? "completed" : ""}> {task.text} </span>
                <span> Priority: {task.priority}</span>
                <span> {task.createdAt.toLocaleString()}</span>
              </div>
            ))}
            </>
            )}

            {filter === "done" && (
            <>
              {doneTasks.map((task) => (
                <div className={task.isDone ? "taskDone" : "task"} key={task.id}>
                <input type="checkbox" checked={task.isDone} onChange={() => toggletaskUndone(task.id)} className={task.isDone ? "doneCheckBox" : ""} />
                <span className={task.isdone ? "completed" : ""}> {task.text} </span>
                <span> Priority: {task.priority}</span>
                <span> {task.createdAt.toLocaleString()}</span>
              </div>
            ))}
            </>
            )}

            {filter === "sorted" && (
            <>
              {sortedTasks.map((task) => (
                <div className={task.isDone ? "taskDone" : "task"} key={task.id}>
                <input type="checkbox" checked={task.isDone} onChange={() => toggleTaskDone(task.id)} className={task.isDone ? "doneCheckBox" : ""} />
                <span className={task.isdone ? "completed" : ""}> {task.text} </span>
                <span> Priority: {task.priority}</span>
                <span> {task.createdAt.toLocaleString()}</span>
              </div>
            ))}
            </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
export default App
