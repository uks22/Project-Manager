import React from "react";
import CloseIcon from "@mui/icons-material/Close";
function Issuewindow(props) {
  var [desc, setDesc] = React.useState(props.desc);
  var [desc1, setDesc1] = React.useState(props.desc1);
  const [currentStatus, setCurrentStatus] = React.useState(
    props.currentStatus || "To-Do"
  );

  const handleStatusChange = (event) => {
    const status = event.target.value;
    props.handleStatusChange(event);
    setCurrentStatus(status);
  };
  // Function to calculate time difference
  const timeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp); // difference in milliseconds

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(diff / (86400000 * 30));
    const years = Math.floor(diff / (86400000 * 365));

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };
  return (
    <div className="issuebody">
      <div className="containerissue">
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span>Add epic</span> / <span className="task-id">SCRUM-16</span>
          </div>
          <div onClick={props.close} style={{ cursor: "pointer" }}>
            <CloseIcon />
          </div>
        </header>

        <main>
          <section className="left-panel">
            <textarea
              style={{
                color: "#4f319b",
                width: "100%",
                border: "none",
                fontSize: "20px",
              }}
              value={desc}
              onChange={(event) => {
                const str = event.target.value;
                setDesc(str);
                props.handleDescChange(str);
              }}
            ></textarea>
            <div className="actions">
              <button className="action-btn">+ Add</button>
              <button className="action-btn">Apps</button>
            </div>
            <div className="descriptionissue">
              <label htmlFor="descriptionissue">Description</label>
              <textarea
                id="description"
                placeholder="Add a description..."
                onChange={(event) => {
                  const str = event.target.value;
                  setDesc1(str);
                  props.handleDesc1Change(str);
                }}
                value={desc1}
              ></textarea>
            </div>
          </section>

          <section className="right-panel">
            <div className="status">
              <select
                id="status"
                value={currentStatus}
                onChange={handleStatusChange}
                style={{
                  backgroundColor:
                    currentStatus == "To-Do"
                      ? "#D3D3D3"
                      : currentStatus == "In Progress"
                      ? "#4169E1"
                      : "#36b37e",
                  border: "none",
                  borderRadius: "5px",
                  padding: "3px 3px",
                  color: currentStatus == "To-Do" ? "black" : "white",
                }}
              >
                <option
                  style={{ backgroundColor: "white", color: "black" }}
                  value="To-Do"
                >
                  To-Do
                </option>
                <option
                  style={{ backgroundColor: "white", color: "black" }}
                  value="In Progress"
                >
                  In Progress
                </option>
                <option
                  style={{ backgroundColor: "white", color: "black" }}
                  value="Done"
                >
                  Done
                </option>
              </select>

              <button className="actions-btn">Actions</button>
            </div>
            <div className="details">
              <h3>Details</h3>
              <ul>
                <li>
                  <strong>Assignee:</strong>{" "}
                  <span className="unassigned">Unassigned</span>{" "}
                  <a href="#">Assign to me</a>
                </li>
                <li>
                  <strong>Labels:</strong> None
                </li>
                <li>
                  <strong>Parent:</strong> None
                </li>
                <li>
                  <strong>Team:</strong> None
                </li>
                <li>
                  <strong>Sprint:</strong> SCRUM Sprint 2
                </li>
                <li>
                  <strong>Story point estimate:</strong> None
                </li>
                <li>
                  <strong>Reporter:</strong> ujjwal kumar singh
                </li>
              </ul>
            </div>
            <div className="timestamps">
              <p>Created {timeAgo(props.created)}</p>
              <p>Updated {timeAgo(props.modified)}</p>
            </div>
          </section>
        </main>

        <footer>
          <div className="activity">
            <h3>Activity</h3>
            <div className="comments">
              <input type="text" placeholder="Add a comment..." />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Issuewindow;
