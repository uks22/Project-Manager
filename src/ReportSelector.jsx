import React, { useState } from "react";
import Report from "./Report"; // Import your Issue Count report
import History from "./History"; // Import your History report

const ReportSelector = (props) => {
  const [selectedReport, setSelectedReport] = useState("issueCount"); // Default report is issueCount

  // Function to toggle between reports
  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center",marginTop:"5px" }}>Select Report to View</h1>
      
      {/* Dropdown to select the report */}
      <select
        value={selectedReport}
        onChange={handleReportChange}
        style={{ display: "block", margin: "20px auto", padding: "10px" }}
      >
        <option value="issueCount">Issue Count Report</option>
        <option value="history">History Report</option>
      </select>

      {/* Conditionally render the selected report */}
      {selectedReport === "issueCount" && <Report issueCount={props.issueCount}/>}
      {selectedReport === "history" && <History history={props.history} issueCount={props.issueCount}/>}
    </div>
  );
};

export default ReportSelector;
