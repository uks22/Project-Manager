import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import AddIcon from '@mui/icons-material/Add';

function YourWork(props) {
  const [projectList, setProjectList] = useState(props.projectList);
  const [addIcon, setAddIcon] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Function to toggle the visibility of the new project form
  function handleIcon() {
    setAddIcon(prev => !prev);
  }

  // Function to handle form submission (creating a new project)
  function handleSubmit(event) {
    event.preventDefault();
    if (newProjectName) {
      const id=props.addProject(newProjectName);

      setProjectList(prev => [...prev, {id:id,project_name:newProjectName,sprint_created:false}]);
      setAddIcon(false); // Hide the form after submission
      setNewProjectName(""); // Clear the input
    }
  }

  return (
    <div className="container">
      <h1>Your Work</h1>
      <div className="underline"></div>

      <h2>Recent Projects</h2>

      <div className="projects" style={{ display: "flex", justifyContent: "left" }}>
        {projectList.map((n, index) => {
          return <ProjectCard handleProjectClick={props.handleProjectClick} id={n.id} key={n.id} name={n.project_name} userTable={props.userTable} />;
        })}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "260px" }}>
          <AddIcon
            style={{
              fontSize: "40px",
              height: "40px",
              backgroundColor: "#3f20c6",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer"
            }}
            onClick={handleIcon}
          />
        </div>
      </div>

      {/* New Project Form */}
      {addIcon && (
        <div className="overlay">
          <div className="new-project-form">
            <h2>Create a New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Create Project</button>
            </form>
            <button onClick={handleIcon} className="close-btn">Close</button>
          </div>
        </div>
      )}

      <div className="description-comments">
        <div className="description"><h2>Description and Comments on Recent Projects:</h2></div>

        <div className="comment">
          <div className="profile-circle">JD</div>
          <div className="comment-text">This project is currently focused on improving user authentication.</div>
        </div>

        <div className="comment">
          <div className="profile-circle">MK</div>
          <div className="comment-text">Looking great! Let me know if you need any help with the front-end.</div>
        </div>

        <div className="comment">
          <div className="profile-circle">AL</div>
          <div className="comment-text">I will update the API tomorrow, check for changes after that.</div>
        </div>
      </div>
    </div>
  );
}

export default YourWork;
