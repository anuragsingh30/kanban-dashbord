import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const apiURL = import.meta.env.VITE_API_URL

export default function KanbanBoard() {
  const [todo, setTodo] = useState([]);
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);
  const [reload, setReload] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [updateId, setUpdateId] = useState("")

  const [addTodoTitle, setAddTodoTitle] = useState("")
  const [addTodoDesc, setAddTodoDesc] = useState("")

  useEffect(() => {
    fetch(`${apiURL}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTodo(data.filter((task) => task.status === "to-do"));
        setDoing(data.filter((task) => task.status === "doing"));
        setDone(data.filter((task) => task.status === "done"));
      });
  }, [reload]);

  function addTodo() {
    const todoData = { title: addTodoTitle, description: addTodoDesc, status: "to-do" }
    fetch(`${apiURL}/`, {
      method: "POST",
      body: JSON.stringify(todoData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(data => {
        setReload((reload) => !reload)
      })
  }

  function deleteTodo(id) {
    const todoData = { id: id }
    fetch(`${apiURL}/`, {
      method: "DELETE",
      body: JSON.stringify(todoData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(data => {
        setReload((reload) => !reload)
      })

  }

  function notifyUpdate(task) {
    setIsUpdate(true);
    setUpdateId(task._id)
    setAddTodoTitle(task.title)
    setAddTodoDesc(task.description)
  }

  function updateTodoStaus(id, status) {
    const todoData = { id: id, status: status }
    fetch(`${apiURL}/status`, {
      method: "PUT",
      body: JSON.stringify(todoData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(data => {
        console.log("todo status updated")
      })
  }

  function updateTodo() {
    const todoData = { id: updateId, title: addTodoTitle, description: addTodoDesc }
    fetch(`${apiURL}/`, {
      method: "PUT",
      body: JSON.stringify(todoData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
      .then(data => {
        setReload((reload) => !reload)
      })
  }

  function cancelUpdate() {
    setIsUpdate(false);
    setUpdateId("")
    setAddTodoTitle("")
    setAddTodoDesc("")
  }

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    // Check if the drag and drop operation was canceled or the item was dropped
    if (!destination) {
      return;
    }

    // Find the source and destination columns based on their IDs
    const sourceColumn = findColumnById(source.droppableId);
    const destinationColumn = findColumnById(destination.droppableId);

    // Find the dragged item
    const draggedItem = findItemById(draggableId, sourceColumn.tasks);
    console.log(draggedItem)

    // Remove the item from the source column
    const newSourceTasks = removeItemById(draggableId, sourceColumn.tasks);
    sourceColumn.setItems(newSourceTasks);

    // Add the item to the destination column
    const newDestinationTasks = [
      ...destinationColumn.tasks.slice(0, destination.index),
      draggedItem,
      ...destinationColumn.tasks.slice(destination.index),
    ];
    destinationColumn.setItems(newDestinationTasks);
    updateTodoStaus(draggedItem._id, getColumnStatusName(destination.droppableId))
  }

  function findColumnById(columnId) {
    switch (columnId) {
      case "1":
        return { tasks: todo, setItems: setTodo };
      case "2":
        return { tasks: doing, setItems: setDoing };
      case "3":
        return { tasks: done, setItems: setDone };
      default:
        return null;
    }
  }

  function getColumnStatusName(columnId) {
    switch (columnId) {
      case "1":
        return "to-do";
      case "2":
        return "doing"
      case "3":
        return "done";
      default:
        return "to-do";
    }
  }



  function findItemById(id, array) {
    return array.find((item) => item._id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item._id != id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div>
          <label>Todo Name</label>
          <input value={addTodoTitle} onChange={(e) => setAddTodoTitle(e.target.value)} type="text" />
        </div>
        <div>
          <label>Todo Description</label>
          <input value={addTodoDesc} onChange={(e) => setAddTodoDesc(e.target.value)} type="text" />
        </div>
        {
          isUpdate ?
            <span>
              <button onClick={updateTodo}>Update Todo</button>
              <button onClick={cancelUpdate}>Cancel Todo</button>
            </span> :
            <button onClick={addTodo}>Add Todo</button>
        }
      </div>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Column title={"To-do"} tasks={todo} id={"1"} notifyUpdate={notifyUpdate} deleteTodo={deleteTodo} />
        <Column title={"Doing"} tasks={doing} id={"2"} notifyUpdate={notifyUpdate} deleteTodo={deleteTodo} />
        <Column title={"Done"} tasks={done} id={"3"} notifyUpdate={notifyUpdate} deleteTodo={deleteTodo} />
      </div>
    </DragDropContext>
  );
}