import { useEffect, useState } from "react";
import "./App.css";
import Column from "./components/Column";
import KanbanBoard from "./components/KanbanBoard";
import Task from "./components/Task";

function App() {
  return (
    <div className="App">
      <KanbanBoard />
    </div>
  );
}

export default App;