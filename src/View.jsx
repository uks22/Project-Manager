import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  Drawer,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Tooltip,
} from "@mui/material";

const View = (props) => {
  const [sortDirections, setSortDirections] = useState(
    new Array(8).fill("asc")
  );
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeSprint, setActiveSprint] = useState("");
  const [issueType, setIssueType] = useState("");
  const [filterVisible, setFilterVisible] = useState(false); // State for Drawer visibility
  const [groupbyVisible, setGroupbyVisible] = useState(false);
  const [groupbyType, setGroupbyType] = useState("");
  const [groupbyStatus, setGroupbyStatus] = useState("");
  const allissue = props.allIssue;
  const [tableData, setTableData] = useState(allissue);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions); // Toggle the state between true and false
  };
  // Utility function to format date as dd-mm-yyyy
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Sorting function
  const sortTable = (columnIndex, flag) => {
    const currentDirection =
      flag === false ? sortDirections[columnIndex] : "desc";
    const newDirection = currentDirection === "asc" ? "desc" : "asc";

    const sortedData = [...tableData].sort((a, b) => {
      let valueA, valueB;

      switch (columnIndex) {
        case 0:
          valueA = a.id;
          valueB = b.id;
          break;
        case 1:
          valueA = a.issue_type;
          valueB = b.issue_type;
          break;
        case 2:
          valueA = a.issue_desc;
          valueB = b.issue_desc;
          break;
        case 3:
          valueA = a.issue_desc1;
          valueB = b.issue_desc1;
          break;
        case 4:
          valueA = a.issue_status;
          valueB = b.issue_status;
          break;
        case 5:
          valueA = a.sprint_name;
          valueB = b.sprint_name;
          break;
        case 6:
          valueA = formatDate(a.created);
          valueB = formatDate(b.created);
          break;
        case 7:
          valueA = formatDate(a.modified);
          valueB = formatDate(b.modified);
          break;
        default:
          valueA = "";
          valueB = "";
      }

      if (!valueA) valueA = "";
      if (!valueB) valueB = "";
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      return currentDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setSortDirections((prevDirections) => {
      const newDirections = [...prevDirections];
      newDirections[columnIndex] = newDirection;
      return newDirections;
    });

    setTableData(sortedData);
  };
  // Function to highlight text
  function highlightText(text, search) {
    if (!text || !search) return text; // Return original text if no search or text

    const regex = new RegExp(`(${search})`, "gi"); // Create a case-insensitive regex for the search term
    return text.split(regex).map(
      (part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        ) // Non-matching part returns as it is
    );
  }

  // Filtering function
  const filteredData = tableData.filter((row) => {
    const summaryMatch = row.issue_desc
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const statusMatch = filterStatus ? row.issue_status === filterStatus : true;
    const sprintMatch = activeSprint ? row.sprint_name === activeSprint : true;
    const issueTypeMatch = issueType ? row.issue_type === issueType : true;
    return summaryMatch && statusMatch && sprintMatch && issueTypeMatch;
  });

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#252525",
        padding: "10px",
      }}
    >
      <h1>View</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "white",
            alignItems: "center",
            borderRadius: "25px",
            height: "35px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically (if needed)
              paddingLeft: "5px",
              cursor: "pointer", // Show pointer when hovering over SearchIcon
            }}
            onClick={toggleOptions} // Toggle options when icon is clicked
          >
            <SearchIcon />
          </div>

          {/* The hidden options dropdown */}
          {showOptions && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "white",
                transform: " translateY(75%)", // Center it horizontally below the icon

                borderRadius: "4px",
              

                zIndex: 10, // Make sure the dropdown is above other elements
              }}
            >
              <div
                class="viewtask"
                style={{
                  cursor: "pointer",
                  padding: "0 0",
                  margin: "0",
                  borderRadius: "0",
                }}
              >
                ID
              </div>
              <div
                class="viewtask"
                style={{
                  cursor: "pointer",
                  padding: "0 0",
                  margin: "0",
                  borderRadius: "0",
                }}
              >
                Summary
              </div>
              <div
                class="viewtask"
                style={{
                  cursor: "pointer",
                  padding: "0 3px",
                  margin: "0",
                  borderRadius: "0",
                }}
              >
                description
              </div>
            </div>
          )}
          <div style={{ height: "100%", borderRadius: "50%" }}>
            <input
              type="text"
              id="filter"
              placeholder="Type to search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                outline: "none",
                padding: "5px",
                width: "250px",
                height: "100%",
                border: "none",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>

        {/* Filter Icon and toggle drawer visibility */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100px",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Filter" arrow>
              <IconButton
                onClick={() => setFilterVisible(true)}
                sx={{
                  color: "white",
                  backgroundColor: "#7234fa",
                  "&:hover": {
                    backgroundColor: "white", // Hover background color
                    color: "#7234fa",
                  },
                  "&:focus": {
                    outline: "none", // Removes the focus ring (border)
                  },
                  "&:active": {
                    outline: "none", // Removes the active click border
                  },
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Group-by" arrow>
              <IconButton
                onClick={() => setGroupbyVisible(true)}
                sx={{
                  color: "white",
                  backgroundColor: "#7234fa",
                  "&:hover": {
                    backgroundColor: "white", // Hover background color
                    color: "#7234fa",
                  },
                  "&:focus": {
                    outline: "none", // Removes the focus ring (border)
                  },
                  "&:active": {
                    outline: "none", // Removes the active click border
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Drawer for Filter Options */}
      <Drawer
        anchor="right"
        open={filterVisible}
        onClose={() => setFilterVisible(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            padding: "20px",
          },
        }}
      >
        <h3>Filter Options</h3>
        <div style={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="statusFilter">Filter by Status</InputLabel>
            <Select
              labelId="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="To-Do">To-Do</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="sprintFilter">Filter by Sprint</InputLabel>
            <Select
              labelId="sprintFilter"
              value={activeSprint}
              onChange={(e) => setActiveSprint(e.target.value)}
              label="Filter by Sprint"
            >
              <MenuItem value="">All Sprints</MenuItem>
              {/* Replace with actual dynamic sprints */}
              <MenuItem value="Sprint 1">Sprint 1</MenuItem>
              <MenuItem value="Sprint 2">Sprint 2</MenuItem>
              <MenuItem value="Sprint 3">Sprint 3</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="typeFilter">Filter by Issue Type</InputLabel>
            <Select
              labelId="typeFilter"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              label="Filter by Issue Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="1">Task</MenuItem>
              <MenuItem value="2">Story</MenuItem>
              <MenuItem value="3">Bug</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setFilterVisible(false)}
        >
          Apply Filters
        </Button>
      </Drawer>
      <Drawer
        anchor="right"
        open={groupbyVisible}
        onClose={() => setGroupbyVisible(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            padding: "20px",
          },
        }}
      >
        <h3>Group By Options</h3>

        {/* Group by Issue Type */}
        <div style={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="groupByType">Group by Issue Type</InputLabel>
            <Select
              labelId="groupByType"
              onChange={(e) => {
                console.log(e);
                setGroupbyType(e.target.value);
                sortTable(1, true);
              }}
              label="Group by Issue Type"
              value={groupbyType}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="type">Issue Type</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Group by Status */}
        <div style={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="groupByStatus">Group by Status</InputLabel>
            <Select
              labelId="groupByStatus"
              onChange={(e) => {
                sortTable(4, true);
                setGroupbyStatus(e.target.value);
              }}
              label="Group by Status"
              value={groupbyStatus}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setGroupbyVisible(false)}
        >
          Apply Grouping
        </Button>
      </Drawer>
      {/* Table with filtered data */}
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ color: "white" }}>
              {[
                "ID",
                "Type",
                "Summary",
                "Description",
                "Status",
                "Sprint Name",
                "Date Created",
                "Modified",
              ].map((header, index) => (
                <th
                  key={header}
                  onClick={() => sortTable(index, false)}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    backgroundColor: "#994cfe",
                    cursor: "pointer",
                  }}
                >
                  {header}{" "}
                  <span style={{ marginLeft: "5px", fontSize: "12px" }}>
                    {sortDirections[index] === "asc" ? "▲" : "▼"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} data-status={row.issue_status}>
                <td>{row.id}</td>
                <td style={{ textAlign: "center" }}>
                  <img
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                    src={
                      row.issue_type == 1
                        ? "./assets/check.png"
                        : row.issue_type == 2
                        ? "./assets/bookmark-svgrepo-com.svg"
                        : "./assets/2136999.webp"
                    }
                    width={25}
                    alt="issue type icon"
                  />
                </td>
                <td>{highlightText(row.issue_desc, filterText)}</td>
                <td>{highlightText(row.issue_desc1, filterText)}</td>
                <td>
                  <span
                    className={`statusview ${row.issue_status}`}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor:
                        row.issue_status === "Done"
                          ? "#4caf50"
                          : row.issue_status === "In Progress"
                          ? "#ff9800"
                          : "#f44336",
                    }}
                  >
                    {row.issue_status}
                  </span>
                </td>
                <td>{row.sprint_name || "N/A"}</td>
                <td>{formatDate(row.created)}</td>
                <td>{formatDate(row.modified)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default View;
