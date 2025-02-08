import React, { useState } from "react";

function CreateSprint(props) {
  // State to hold form values
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
    const day = String(d.getDate()).padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  };
  var { sprint_name, start_date, end_date, sprint_goal } = props.sprintInfo;
  const [sprintName, setSprintName] = useState(sprint_name);
  const [startDate, setStartDate] = useState(formatDate(start_date));
  const [endDate, setEndDate] = useState(formatDate(end_date));
  const [sprintGoal, setSprintGoal] = useState(sprint_goal);
  const sprintStarted = props.sprintStarted;
  // Handle Input Changes
  const handleInputChange = (e, setter) => {
    setter(e.target.value); // Update the respective field's state
  };

  return (
    <div className="createSprintContainer">
      <div className="subcontainer">
        <h1>Sprint Details</h1>
        <div className="underline"></div>

        <div className="sprint-form">
          <h2>Enter Sprint Details</h2>

          <label htmlFor="sprint-name">Sprint Name</label>
          <input
            type="text"
            id="sprint-name"
            placeholder="Enter Sprint Name"
            value={sprintName}
            onChange={(e) => handleInputChange(e, setSprintName)}
            required
          />

          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => handleInputChange(e, setStartDate)}
            required
          />

          <label htmlFor="end-date">End Date</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => handleInputChange(e, setEndDate)}
            required
          />

          <label htmlFor="sprint-goal">Sprint Goal</label>
          <textarea
            id="sprint-goal"
            placeholder="Enter Sprint Goal"
            rows="4"
            value={sprintGoal}
            onChange={(e) => handleInputChange(e, setSprintGoal)}
            required
          ></textarea>

          {/* Buttons for Submit and Close */}
          <div className="formbuttons">
            <div>
              <button
                type="submit"
                name={props.spri}
                className="submitbtn"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  // Call the parent's handleSprintSubmit function
                  props.handleSprintSubmit({
                    sprintName,
                    startDate,
                    endDate,
                    sprintGoal,
                    props,
                    sprintStarted,
                  });
                }}
              >
                Submit
              </button>
            </div>
            <div>
              <button
                type="button"
                className="closebtn"
                onClick={props.handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSprint;
