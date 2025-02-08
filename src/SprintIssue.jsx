import React, { useState } from "react";
import Issuewindow from "./Issuewindow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
function SprintIssue(props) {
  const [displayIssueWIndow, setDisplayIssueWindow] = useState(false);
  const [issueType, setIssueType] = useState(props.issuetype);
  const [drop, setDrop] = useState(false);
  const [drop1, setDrop1] = useState(false);
  const [status, setStatus] = useState(props.stat); // State for task status
  const [option, setOption] = useState(false);
  // Handle the drop-down for issue type selection
  function handleDrop() {
    setDrop((prev) => !prev);
  }

  // Handle issue type change (task, story, bug)
  function handleIssue(event) {
    const name = event.target.name;
    if (name === "task") {
      props.handleTypeChange(props.id, "1");
      setIssueType(1);
    } else if (name === "story") {
      props.handleTypeChange(props.id, "2");
      setIssueType(2);
    } else {
      props.handleTypeChange(props.id, "3");
      setIssueType(3);
    }
    handleDrop(); // Close the dropdown after selecting
  }

  // Handle status change from the dropdown
  function handleStatusChange(event) {
    const val = event.target.value;
    console.log(val);
    props.handleStatusChange(props.id, val);
    setStatus(event.target.value);
  }
  function handleIssueWindow() {
    setDisplayIssueWindow((prev) => !prev);
  }

  return (
    <div>
      <div
        onMouseEnter={() => {
          setOption((prev) => !prev);
        }}
        onMouseLeave={() => {
          setOption((prev) => !prev);
          setDrop1(false);
        }}
        draggable="true"
        onDragStart={props.drag}
        className="sprint-list"
        id={props.id}
        style={{ display: props.rightArrow ? "flex" : "none" }}
        type={props.type}
      >
        <div className="issue-type">
          <img
            src={
              issueType === 1
                ? "./assets/check.png"
                : issueType === 2
                ? "./assets/bookmark-svgrepo-com.svg"
                : "./assets/2136999.webp"
            }
            onClick={handleDrop}
            className="task-image"
          />
          <div
            className="dropdown-content"
            style={{ display: drop ? "block" : "none" }}
          >
            <div onClick={handleIssue}>
              <img name="task" src="./assets/check.png" alt="task" />
            </div>
            <div onClick={handleIssue}>
              <img
                name="story"
                src="./assets/bookmark-svgrepo-com.svg"
                alt="story"
              />
            </div>
            <div onClick={handleIssue}>
              <img name="bug" src="./assets/2136999.webp" alt="Bug" />
            </div>
          </div>
        </div>

        <div onClick={handleIssueWindow} style={{ cursor: "pointer" }}>
          <span>{props.desc}</span>
        </div>

        {/* Rightmost status dropdown */}
        <div className="status-dropdown" style={{ marginLeft: "auto" }}>
          <select value={status} onChange={handleStatusChange}>
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        {/* More icon, hidden by default */}
        <div
          className="more-icon"
          style={{ display: option ? "block" : "none", cursor: "pointer" }}
        >
          <div
            onClick={() => {
              setDrop1((prev) => !prev);
            }}
          >
            <MoreVertIcon />
          </div>

          <div
            className="dropdown-content1"
            style={{
              display: drop1 ? "block" : "none",
              right: props.right ? "10px" : "none",
            }}
            onClick={() => {
              props.handleIssueDelete(props.id);
            }}
          >
            DELETE
          </div>
        </div>
      </div>
      {displayIssueWIndow ? (
        <Issuewindow
          created={props.created}
          modified={props.modified}
          currentStatus={props.stat}
          handleStatusChange={handleStatusChange}
          close={handleIssueWindow}
          desc={props.desc}
          desc1={props.desc1}
          handleDescChange={(val) => {
            props.onDescChange(val);
          }}
          handleDesc1Change={(val) => {
            props.onDesc1Change(val);
          }}
        />
      ) : null}
    </div>
  );
}

export default SprintIssue;
