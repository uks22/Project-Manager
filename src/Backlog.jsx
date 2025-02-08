import React, { useState } from "react";
import SprintIssue from "./SprintIssue";
import CreateSprint from "./createSprint";
import "./index.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
function Backlog(props) {
  console.log(props.sprintInfo);
  var { sprint_name, start_date, end_date, sprint_goal } = props.sprintInfo;

  const [sprintDetails, setSprintDetails] = useState({
    sprintName: sprint_name,
    startDate: start_date,
    endDate: end_date,
    sprintGoal: sprint_goal,
  });
  const sprint_started=props.sprintStarted;
  const [sprintStarted, setSprintStarted] = useState(sprint_started);
  const [editOrStart, setEditOrStart] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // State to toggle options visibility
  const [hoveredButton, setHoveredButton] = useState(null);
  const [rightArrow, setRightArrow] = useState(false);
  const [rightArrow1, setRightArrow1] = useState(false);
  const [createIssue, setCreateIssue] = useState(false);
  // Separate arrays for Sprint and Backlog
  const issues = props.listOfIssues;
  const backlogissues = props.listOfBacklogIssues;
  console.log(issues);
  const [sprintList, setSprintList] = useState(issues);

  const [backlogList, setBacklogList] = useState(backlogissues);

  const [isModalOpen, setIsModalOpen] = useState(0); // 0 means no modal is open
  const [issueDescription, setIssueDescription] = useState("");
  function handleSprintSubmit(sprintDetails) {
    setSprintDetails({
      sprintName: sprintDetails.sprintName,
      startDate: sprintDetails.startDate,
      endDate: sprintDetails.endDate,
      sprintGoal: sprintDetails.sprintGoal,
    });
    props.handleSprintSubmit(sprintDetails);
    handleCreateIssue();
    if (editOrStart) {
      props.handleSprintStarted(true);
      setSprintStarted((prev) => !prev);
      setEditOrStart(false);
    }
  }
  function drag(ev) {
    console.log(ev);
    const datatotranfer = JSON.stringify({
      id: ev.target.getAttribute("id"),
      type: ev.target.getAttribute("type"),
    });
    ev.dataTransfer.setData("text", datatotranfer);
  }
  function handleCreateIssue(event) {
    console.log(event);
    if (event === 1) {
      setEditOrStart((prev) => !prev);
    }
    setShowOptions(false);
    setCreateIssue((prev) => !prev);
  }
  async function drop(ev) {
    ev.preventDefault(); // Prevent the default behavior (open the dragged element if it's an anchor)

    // Get the data (the id of the dragged element)
    var data = JSON.parse(ev.dataTransfer.getData("text"));

    // Adding item from backlog to sprint
    if (data.type === "backlog") {
      const { sprintIssues, backlogIssues } = await props.handleDragIssue(
        data.id,
        true
      );
      setSprintList(sprintIssues);

      // Removing the item from the backlog

      setBacklogList(backlogIssues);
    }
  }
  async function drop1(ev) {
    ev.preventDefault(); // Prevent the default behavior (open the dragged element if it's an anchor)

    // Get the data (the id of the dragged element)
    var data = JSON.parse(ev.dataTransfer.getData("text"));
    console.log(data);
    // Adding item from backlog to sprint
    if (data.type === "sprint") {
      const { sprintIssues, backlogIssues } = await props.handleDragIssue(
        data.id,
        false
      );
      setSprintList(sprintIssues);

      // Removing the item from the backlog

      setBacklogList(backlogIssues);
    }
  }
  // Function to toggle the arrow direction for Sprint
  function handleRightArrow() {
    setRightArrow((prev) => !prev);
  }

  // Function to toggle the arrow direction for Backlog
  function handleRightArrow1() {
    setRightArrow1((prev) => !prev);
  }

  // Function to open the modal for Sprint
  function openModal() {
    setIsModalOpen(1); // Set modal state to 1 for Sprint
  }

  // Function to open the modal for Backlog
  function openModal1() {
    setIsModalOpen(2); // Set modal state to 2 for Backlog
  }

  // Function to close the modal
  function closeModal() {
    setIsModalOpen(0); // Close the modal (reset to 0)
    setIssueDescription(""); // Reset the issue description field
  }

  // Function to handle adding the issue (add to Sprint)
  async function handleAddIssue() {
    if (issueDescription) {
      const newElement = await props.handleAddIssue(issueDescription);
      console.log(newElement);
      setSprintList((prevList) => [...prevList, newElement]);
      closeModal(); // Close the modal after adding the issue
    }
  }
  const formatDate = (dateString) => {
    console.log(dateString);
    const options = { day: "numeric", month: "short" }; // 'short' gives the abbreviated month name
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options); // 'en-GB' gives the "3 Nov" format
  };
  // Function to handle adding the issue (add to Backlog)
  async function handleAddIssue1() {
    if (issueDescription) {
      const newElement = await props.handleAddIssue1(issueDescription);
      setBacklogList((prevList) => [...prevList, newElement]);
      closeModal(); // Close the modal after adding the issue
    }
  }
  function allowDrop(ev) {
    ev.preventDefault(); // Default behavior is to not allow drop
  }
  return (
    <div>
      {/* Sprint Container */}
      <div className="sprint-container" onDrop={drop} onDragOver={allowDrop}>
        <div className="sprint-title">
          <div className="sprint-left1">
            <div
              className="arrow"
              id="arrow"
              onClick={handleRightArrow}
              style={{ transform: rightArrow ? "rotate(90deg)" : "none" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="10"
                height="10"
                viewBox="0 0 256 256"
              >
                <g transform="translate(18.12918287937744 236.87470817120618) rotate(-90) scale(2.43 2.43)">
                  <path
                    d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                    fill="rgb(0,0,0)"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            <div className="sprint-name">{sprintDetails.sprintName}</div>
            <div className="sprint-date">
              {formatDate(sprintDetails.startDate)} -{" "}
              {formatDate(sprintDetails.endDate)}
            </div>
            <div className="sprint-issues">({sprintList.length} issues)</div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              name="start"
              onClick={() => {
                if(!sprintStarted)handleCreateIssue(1);
              }}
            >
              <span style={{ color: "#172b4d" }}>
                {sprintStarted ? "Complete Sprint" : "Start Sprint"}
              </span>
            </button>

            <div style={{ position: "relative" }}>
              <MoreVertIcon
                onClick={() => setShowOptions(!showOptions)}
                style={{ cursor: "pointer" }}
              />

              {showOptions && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px", // Adjust this depending on your layout
                    right: "0",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "8px",
                    borderRadius: "4px",
                    zIndex: 1,
                  }}
                >
                  <button
                    name="edit"
                    onClick={() => {
                      handleCreateIssue(2);
                    }}
                    onMouseEnter={() => setHoveredButton("edit")}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      padding: "8px",
                      display: "block",
                      width: "100%",
                      backgroundColor:
                        hoveredButton === "edit" ? "#f0f0f0" : "white", // Change background color on hover
                      border: "none",
                      textAlign: "left", // Optional: Align text to the left for a better look
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      console.log("Delete clicked");
                      setShowOptions(false); // Close the menu after selection
                    }}
                    onMouseEnter={() => setHoveredButton("delete")}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      padding: "8px",
                      display: "block",
                      width: "100%",
                      backgroundColor:
                        hoveredButton === "delete" ? "#f0f0f0" : "white", // Change background color on hover
                      border: "none",
                      textAlign: "left", // Optional: Align text to the left for a better look
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render Sprint Issues */}
        {sprintList.map((ele, index) => {
          return (
            <SprintIssue
              right={true}
              handleIssueDelete={(id) => {
                props.handleIssueDelete(id);
                const newSprintList = sprintList.filter((ele) => {
                  return ele.id != id;
                });
                setSprintList(newSprintList);
              }}
              handleStatusChange={async (id, status) => {
                const result = await props.handleStatusChange(id, status);
                var arr = sprintList.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setSprintList(arr);
              }}
              handleTypeChange={async (id, issueType) => {
                const result = await props.handleTypeChange(id, issueType);
                console.log(result);
                var arr = sprintList.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setSprintList(arr);
              }}
              key={index}
              id={ele.id}
              index={index}
              desc={ele.issue_desc}
              desc1={ele.issue_desc1}
              stat={ele.issue_status}
              created={ele.created}
              modified={ele.modified}
              issuetype={parseInt(ele.issue_type, 10)}
              rightArrow={rightArrow}
              drag={drag}
              type="sprint"
              onDescChange={async (val) => {
                const result = await props.handleDescChange(ele.id, val);
                console.log(val);
                const arr1 = sprintList.slice();
                console.log(arr1);
                arr1[index].issue_desc = val;
                arr1[index].modified = result[0].modified;
                setSprintList(arr1);
              }}
              onDesc1Change={async (val) => {
                const result = await props.handleDesc1Change(ele.id, val);
                const arr1 = sprintList.slice();
                arr1[index].issue_desc1 = val;
                arr1[index].modified = result[0].modified;
                setSprintList(arr1);
              }}
            />
          );
        })}

        <div className="add-issue" onClick={openModal}>
          <span style={{ fontSize: "20px" }}>+</span>
          <span>Add Issue</span>
        </div>
      </div>

      {/* Backlog Container */}
      <div className="backlog-container" onDrop={drop1} onDragOver={allowDrop}>
        <div className="backlog-title">
          <div className="backlog-left1">
            <div
              className="arrow"
              id="arrow"
              onClick={handleRightArrow1}
              style={{ transform: rightArrow1 ? "rotate(90deg)" : "none" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="10"
                height="10"
                viewBox="0 0 256 256"
              >
                <g transform="translate(18.12918287937744 236.87470817120618) rotate(-90) scale(2.43 2.43)">
                  <path
                    d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                    fill="rgb(0,0,0)"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            <div className="backlog-name">Backlog</div>
            <div className="backlog-issues">({backlogList.length} issues)</div>
          </div>

          <div>
            <button onClick={openModal1}>
              <span style={{ color: "#172b4d" }}>Create Backlog</span>
            </button>
          </div>
        </div>

        {/* Render Backlog Issues */}
        {backlogList.map((ele, index) => {
          return (
            <SprintIssue
              right={true}
              handleIssueDelete={(id) => {
                props.handleIssueDelete(id);
                const newBacklogList = backlogList.filter((ele) => {
                  return ele.id != id;
                });
                setBacklogList(newBacklogList);
              }}
              handleStatusChange={async (id, status) => {
                const result = await props.handleStatusChange(id, status);
                var arr = backlogList.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setBacklogList(arr);
              }}
              handleTypeChange={async (id, issueType) => {
                const result = await props.handleTypeChange(id, issueType);
                console.log(result);
                var arr = backlogList.map((ele) => {
                  if (ele.id == id) {
                    return { ...ele, modified: result[0].modified };
                  }
                  return ele;
                });
                setBacklogList(arr);
              }}
              key={index}
              index={index}
              id={ele.id}
              desc={ele.issue_desc}
              desc1={ele.issue_desc1}
              stat={ele.issue_status}
              created={ele.created}
              modified={ele.modified}
              issuetype={parseInt(ele.issue_type, 10)}
              rightArrow={rightArrow1}
              drag={drag}
              type="backlog"
              onDescChange={async (val) => {
                const result = await props.handleDescChange(ele.id, val);
                console.log(val);
                const arr1 = backlogList.slice();
                console.log(arr1);
                arr1[index].issue_desc = val;
                arr1[index].modified = result[0].modified;
                setBacklogList(arr1);
              }}
              onDesc1Change={async (val) => {
                const result = await props.handleDesc1Change(ele.id, val);
                const arr1 = backlogList.slice();
                arr1[index].issue_desc1 = val;
                arr1[index].modified = result[0].modified;
                setBacklogList(arr1);
              }}
            />
          );
        })}

        <div className="add-issue" onClick={openModal1}>
          <span style={{ fontSize: "20px" }}>+</span>
          <span>Add Issue</span>
        </div>
      </div>
      {createIssue && (
        <CreateSprint
          handleClose={handleCreateIssue}
          handleSprintSubmit={handleSprintSubmit}
          sprintStarted={sprintStarted}
          sprintInfo = {props.sprintInfo}
        />
      )}
      {/* Modal for adding new issue */}
      {isModalOpen !== 0 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Issue</h3>
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div style={{ paddingRight: "20px" }}>
                <label>Issue Description:</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={isModalOpen === 1 ? handleAddIssue : handleAddIssue1}
              >
                Add Issue
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Backlog;
