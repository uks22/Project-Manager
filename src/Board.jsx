import React, { useState } from "react";
import SprintIssue from "./SprintIssue";

function Board(props) {

  const todo = props.issues.filter((ele) => {
    return ele.issue_status == "To-Do";
  });
  const inprogress = props.issues.filter((ele) => {
    return ele.issue_status == "In Progress";
  });
  const Done = props.issues.filter((ele) => {
    return ele.issue_status == "Done";
  });
  const [toDO, setToDo] = useState(todo);
  const [inProgress, setInProgress] = useState(inprogress);
  const [done, setDone] = useState(Done);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [taskDesc, setTaskDesc] = useState("");

  // Helper function to handle task moving between columns
  const moveTask = (task, source, target) => {
    const sourceArray = [...source];
    const taskIndex = sourceArray.findIndex((item) => item.id === task.id);
    if (taskIndex !== -1) {
      sourceArray.splice(taskIndex, 1);
    }

    const targetArray = [...target, task];

    if (source === toDO) setToDo(sourceArray);
    if (source === inProgress) setInProgress(sourceArray);
    if (source === done) setDone(sourceArray);

    if (target === toDO) setToDo(targetArray);
    if (target === inProgress) setInProgress(targetArray);
    if (target === done) setDone(targetArray);
  };

  const handleDragStart = (e, id, source) => {
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.setData("source", source);
  };

  const handleDrop = async (e, target) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const source = e.dataTransfer.getData("source");
    console.log(taskId + " " + source + " ");
    console.log(target);
    if (target === source) return;
    if (target === "To-Do") {
      if (source === "In Progress") {
        console.log(taskId);
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "To-Do"
        );
        const newInProgress = inProgress.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setInProgress(newInProgress);
        setToDo((prev) => [...prev, result[0]]);
      } else {
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "To-Do"
        );
        const newDone = done.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setDone(newDone);
        setToDo((prev) => [...prev, result[0]]);
      }
    } else if (target === "In Progress") {
      if (source === "To-Do") {
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "In Progress"
        );
        const newToDo = toDO.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setToDo(newToDo);
        setInProgress((prev) => [...prev, result[0]]);
      } else {
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "In Progress"
        );
        const newDone = done.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setDone(newDone);
        setInProgress((prev) => [...prev, result[0]]);
      }
    } else {
      if (source === "To-Do") {
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "Done"
        );
        const newToDo = toDO.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setToDo(newToDo);
        setDone((prev) => [...prev, result[0]]);
      } else {
        const result = await props.handleStatusChange(
          parseInt(taskId, 10),
          "Done"
        );
        const newInProgress = inProgress.filter((ele) => {
          return ele.id !== parseInt(taskId, 10);
        });
        setInProgress(newInProgress);
        setDone((prev) => [...prev, result[0]]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addTask = async (desc, column) => {
    const newTask = await props.handleAddCustomIssue(desc, column);
    if (column === "To-Do") {
      setToDo([...toDO, newTask]);
    } else if (column === "In Progress") {
      setInProgress([...inProgress, newTask]);
    } else if (column === "Done") {
      setDone([...done, newTask]);
    }
  };

  const openModal = (column) => {
    setCurrentColumn(column);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentColumn(null);
    setTaskDesc(""); // Clear description
  };

  const handleChange = (e) => {
    setTaskDesc(e.target.value);
  };

  const handleSubmit = () => {
    if (taskDesc.trim()) {
      addTask(taskDesc, currentColumn);
      closeModal(); // Close modal after adding task
    } else {
      alert("Please enter a task description.");
    }
  };

  return (
    <div className="board">
      {/* Task Modal */}
      {isModalOpen && (
        <div className="task-modal-overlay">
          <div className="task-modal-content">
            <h2>Add Task</h2>
            <input
              type="text"
              value={taskDesc}
              onChange={handleChange}
              placeholder="Enter task description"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={handleSubmit}>Add Task</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* To-Do Column */}
      <div
      
        key={1}
        className="column"
        id="todo-column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "To-Do")}
      >
        <h2>To Do</h2>
        <button className="add-task" onClick={() => openModal("To-Do")}>
          Add Task
        </button>
        {toDO.map((task, index) => (
          <div

            key={task.id}
            id={task.id}
            onDragStart={(e) => handleDragStart(e, task.id, "To-Do")}
            draggable={true}
          >
            <SprintIssue
              handleIssueDelete={(id)=>{
                props.handleIssueDelete(id);
                var newToDo = toDO.filter((ele)=>{
                  return ele.id != id;
                });
                setToDo(newToDo);
              }}
              right={false}
              handleStatusChange={async (id, status) => {
                const result = await props.handleStatusChange(id, status);
                const newToDo = toDO.filter((ele) => {
                  return ele.id != id;
                });
                setToDo(newToDo);
                if (status == "To-Do") {
                  setToDo((prev) => [...prev, result[0]]);
                } else if (status == "In Progress") {
                  setInProgress((prev) => [...prev, result[0]]);
                } else {
                  setDone((prev) => [...prev, result[0]]);
                }
              }}
              handleTypeChange={async (id, issueType) => {
                const result = await props.handleTypeChange(id, issueType);
                console.log(result);
                var arr = toDO.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setToDo(arr);
              }}
              key={task.id}
              id={task.id}
              desc={task.issue_desc}
              desc1={task.issue_desc1}
              stat={task.issue_status}
              created={task.created}
              modified={task.modified}
              issuetype={parseInt(task.issue_type, 10)}
              onDescChange={async (val) => {
                const result = await props.handleDescChange(task.id, val);
                console.log(val);
                const arr1 = toDO.slice();
                console.log(arr1);
                arr1[index].issue_desc = val;
                arr1[index].modified = result[0].modified;
                setToDo(arr1);
              }}
              onDesc1Change={async (val) => {
                const result = await props.handleDesc1Change(task.id, val);
                const arr1 = toDO.slice();
                arr1[index].issue_desc1 = val;
                arr1[index].modified = result[0].modified;
                setToDo(arr1);
              }}
              rightArrow={true}
              type="sprint"
            />
          </div>
        ))}
      </div>

      {/* In Progress Column */}
      <div
        key={2}
        className="column"
        id="in-progress-column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "In Progress")}
      >
        <h2>In Progress</h2>
        <button className="add-task" onClick={() => openModal("In Progress")}>
          Add Task
        </button>
        {inProgress.map((task, index) => (
          <div
            key={task.id}
            onDragStart={(e) => handleDragStart(e, task.id, "In Progress")}
            draggable={true}
            id={task.id}
          >
            <SprintIssue
              right={false}
              handleStatusChange={async (id, status) => {
                const result = await props.handleStatusChange(id, status);
                const newInProgress = inProgress.filter((ele) => {
                  return ele.id != id;
                });
                setInProgress(newInProgress);
                if (status == "To-Do") {
                  setToDo((prev) => [...prev, result[0]]);
                } else if (status == "In Progress") {
                  setInProgress((prev) => [...prev, result[0]]);
                } else {
                  setDone((prev) => [...prev, result[0]]);
                }
              }}
              handleTypeChange={async (id, issueType) => {
                const result = await props.handleTypeChange(id, issueType);
                console.log(result);
                var arr = inProgress.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setInProgress(arr);
              }}
              key={task.id}
              id={task.id}
              desc={task.issue_desc}
              desc1={task.issue_desc1}
              stat={task.issue_status}
              created={task.created}
              modified={task.modified}
              issuetype={parseInt(task.issue_type, 10)}
              onDescChange={async (val) => {
                const result = await props.handleDescChange(task.id, val);
                console.log(val);
                const arr1 = inProgress.slice();
                console.log(arr1);
                arr1[index].issue_desc = val;
                arr1[index].modified = result[0].modified;
                setInProgress(arr1);
              }}
              onDesc1Change={async (val) => {
                const result = await props.handleDesc1Change(task.id, val);
                const arr1 = inProgress.slice();
                arr1[index].issue_desc1 = val;
                arr1[index].modified = result[0].modified;
                setInProgress(arr1);
              }}
              rightArrow={true}
              type="sprint"
            />
          </div>
        ))}
      </div>

      {/* Done Column */}
      <div
        key={3}
        className="column"
        id="done-column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "Done")}
      >
        <h2>Done</h2>
        <button className="add-task" onClick={() => openModal("Done")}>
          Add Task
        </button>
        {done.map((task, index) => (
          <div
            key={task.id}
            id={task.id}
            onDragStart={(e) => handleDragStart(e, task.id, "Done")}
            draggable={true}
          >
            <SprintIssue
              right={true}
              handleStatusChange={async (id, status) => {
                const result = await props.handleStatusChange(id, status);
                const newDone = done.filter((ele) => {
                  return ele.id != id;
                });
                setDone(newDone);
                if (status == "To-Do") {
                  setToDo((prev) => [...prev, result[0]]);
                } else if (status == "In Progress") {
                  setInProgress((prev) => [...prev, result[0]]);
                } else {
                  setDone((prev) => [...prev, result[0]]);
                }
              }}
              handleTypeChange={async (id, issueType) => {
                const result = await props.handleTypeChange(id, issueType);
                console.log(result);
                var arr = done.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setDone(arr);
              }}
              key={task.id}
              id={task.id}
              desc={task.issue_desc}
              desc1={task.issue_desc1}
              stat={task.issue_status}
              created={task.created}
              modified={task.modified}
              issuetype={parseInt(task.issue_type, 10)}
              onDescChange={async (val) => {
                const result = await props.handleDescChange(task.id, val);
                console.log(val);
                const arr1 = done.slice();
                console.log(arr1);
                arr1[index].issue_desc = val;
                arr1[index].modified = result[0].modified;
                setDone(arr1);
              }}
              onDesc1Change={async (val) => {
                const result = await props.handleDesc1Change(task.id, val);
                const arr1 = done.slice();
                arr1[index].issue_desc1 = val;
                arr1[index].modified = result[0].modified;
                setDone(arr1);
              }}
              rightArrow={true}
              type="sprint"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
