import { useEffect, useState } from "react";
import { TaskType } from "../../types/TaskTypes";
import styles from "./styles.module.scss";

export default function Home() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);

  async function handleAddTask() {
    try {
      await fetch("http://localhost:3334/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: input,
          status: "pending",
        }),
        headers: {
          "Content-Type": "Application/json",
        },
      });

      await getTasks();
      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(task: TaskType) {
    try {
      await fetch(`http://localhost:3334/tasks/${task.id}`, {
        method: "DELETE",
      });
      await getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChangeTaskStatus(task: TaskType) {
    try {
      await fetch(`http://localhost:3334/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...task,
          status: task.status === "pending" ? "done" : "pending",
        }),
        headers: {
          "Content-Type": "Application/json",
        },
      });
      await getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  async function getTasks() {
    const response = await fetch("http://localhost:3334/tasks");
    const data: TaskType[] = await response.json();

    setTasks(data);
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles["container-insert"]}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button onClick={handleAddTask}>Adicionar</button>
      </div>
      <div className={styles["container-tasks"]}>
        <h1>Tarefas</h1>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span
                className={styles[task.status]}
                onClick={() => handleChangeTaskStatus(task)}
              >
                {task.title}
              </span>
              <button onClick={() => handleDelete(task)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
