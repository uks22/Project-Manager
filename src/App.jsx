import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./Header";
import YourWork from "./YourWork";
import SideBar from "./SideBar";
import "./index.css";
import Backlog from "./Backlog";
import Board from "./Board";
import Issuewindow from "./Issuewindow";
import AuthForm from "./AuthForm";
import axios from "axios";
import View from "./View";
import Report from "./Report";
import History from "./History";
import ReportSelector from "./ReportSelector";
function App() {
  var [allIssue, setAllIssue] = useState([]);
  var [project, setProject] = useState(false);
  var [login, setLogin] = useState(false);
  var [userTable, setUserTable] = useState("");
  var [projectList, setProjectList] = useState([]);
  var [currentUserProjectId, setCurrentUserProjectId] = useState(-1);
  var [sprint, setSprint] = useState([]);
  var [currProjectIssues, setCurrProjectIssues] = useState([]);
  var [currProjectBacklogIssues, setCurrProjectBacklogIssues] = useState([]);
  var [backlog, setBacklog] = useState(false);
  var [board, setBoard] = useState(false);
  var [sprintStarted, setSprintStarted] = useState(false);
  var [view, setView] = useState(false);
  var [report, setReport] = useState(false);
  var [issueCount, setIssueCount] = useState([]);
  var [history, setHistory] = useState([]);
  async function handleProjectClick(userTable, name, id) {
    console.log((userTable + " " + name).trim().replace(/\s+/g, "_"));

    setCurrentUserProjectId(id);
    try {
      const result = await axios.post("http://localhost:3000/findissues", {
        userTable,
        id,
      });
      const issues = result.data.issues;
      const backlogissues = result.data.backlogissues;
      const sprintStarted = result.data.sprint_started;
      setSprintStarted(sprintStarted);
      setCurrProjectIssues(issues);
      setCurrProjectBacklogIssues(backlogissues);
      /*Make sure that above code is for getting info regarding current sprint whereas below code is for issues across all the sprint*/
      const result1 = await axios.post("http://localhost:3000/view", {
        userTable,
        id,
      });
      const allissue = result1.data.rows;
      setAllIssue(allissue);
      console.log(allissue);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
    setProject((prev) => !prev);
    setBacklog((prev) => !prev);
    // setProject(prev=>!prev);
  }
  async function handleSprintStarted(val) {
    try {
      const response = await axios.post(
        "http://localhost:3000/handlesprintstart",
        { userTable, currentUserProjectId, val }
      );
    } catch (error) {
      console.log("error changeing sprint started:", error);
    }
  }
  async function handleAddCustomIssue(desc, status) {
    try {
      const ele = sprint.find((ele) => ele.id === currentUserProjectId);
      const sprint_name = ele.sprint_name;
      const result = await axios.post(
        "http://localhost:3000/submitcustomissue",
        {
          desc,
          userTable,
          currentUserProjectId,
          status,
          sprint_name,
        }
      );
      const newElement = result.data.rows[0];
      return newElement;
    } catch (error) {
      console.error("Error adding custom issue:", error);
    }
  }
  async function handleAddIssue(desc) {
    console.log(desc);
    console.log(userTable + " " + currentUserProjectId);
    const ele = sprint.find((ele) => ele.id === currentUserProjectId);
    const sprint_name = ele.sprint_name;
    try {
      const result = await axios.post("http://localhost:3000/submitissue", {
        desc,
        userTable,
        currentUserProjectId,
        sprint_name,
      });
      const newElement = result.data.rows[0];
      return newElement;
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  }
  async function handleAddIssue1(desc) {
    console.log(desc);
    console.log(userTable + " " + currentUserProjectId);
    try {
      const result = await axios.post(
        "http://localhost:3000/submitbacklogissue",
        { desc, userTable, currentUserProjectId }
      );
      const newElement = result.data.rows[0];
      return newElement;
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  }
  async function handleSprintSubmit(sprintDetails) {
    const ele = sprint.find((ele) => ele.id === currentUserProjectId);
    const sprint_name = ele.sprint_name;
    try {
      // Send POST request with the required data
      const response = await axios.post("http://localhost:3000/submitsprint", {
        sprintDetails,
        currentUserProjectId,
        userTable,
        prevName: sprint_name,
      });
      const newSprint = response.data.rows;
      // Handle success response
      console.log(newSprint);
      setSprint(newSprint);
      console.log(response.data.message);
    } catch (error) {
      // Handle error response
      console.error("Error submitting sprint details:", error);
    }
  }
  async function handleTypeChange(id, type) {
    try {
      // Make a POST request to the server with necessary parameters
      const response = await axios.post("http://localhost:3000/typechange", {
        id,
        type,
        userTable, // Ensure `userTable` is defined or passed in this function's scope
        currentUserProjectId, // Ensure `currentUserProjectId` is defined or passed in this function's scope
      });

      // Handle the server response, for example, display a success message
      console.log("Issue type updated successfully:", response.data);

      // Optionally, you can return a success message or update the UI
      return response.data.rows; // or update state/UI here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(
        "Error changing issue type:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show a user-friendly message
      alert("There was an error updating the issue type. Please try again.");

      // You can also return or throw an error for further handling
      throw error;
    }
  }
  async function handleDragIssue(id, is_sprint) {
    try {
      // Make a POST request to the server with necessary parameters
      const response = await axios.post("http://localhost:3000/dragissue", {
        id,
        is_sprint, // Indicates if the issue is being dragged into a sprint
        userTable, // Ensure userTable is defined or passed in this function's scope
        currentUserProjectId, // Ensure currentUserProjectId is defined or passed in this function's scope
      });

      // Handle the server response, for example, display a success message
      console.log("Issue dragged successfully:", response.data);

      // Optionally, you can return a success message or update the UI
      return response.data; // or update state/UI here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(
        "Error dragging the issue:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show a user-friendly message
      alert("There was an error dragging the issue. Please try again.");

      // You can also return or throw an error for further handling
      throw error;
    }
  }

  async function handleStatusChange(id, status) {
    try {
      // Make a POST request to the server with the necessary parameters
      const response = await axios.post("http://localhost:3000/statuschange", {
        id,
        status,
        userTable, // Ensure `userTable` is defined or passed in this function's scope
        currentUserProjectId, // Ensure `currentUserProjectId` is defined or passed in this function's scope
      });

      // Handle the server response, for example, display a success message
      console.log("Issue status updated successfully:", response.data);

      // Optionally, you can return a success message or update the UI
      return response.data.rows; // or update state/UI here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(
        "Error changing issue status:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show a user-friendly message
      alert("There was an error updating the issue status. Please try again.");

      // You can also return or throw an error for further handling
      throw error;
    }
  }
  async function handleIssueDelete(id) {
    try {
      const response = await axios.delete("http://localhost:3000/deleteissue", {
        params: { id, userTable, currentUserProjectId },
      });
    } catch (error) {
      console.error("Error while deleting an issue:", error);
    }
  }
  async function handleDescChange(id, description) {
    try {
      // Make a POST request to the server with the necessary parameters
      const response = await axios.post(
        "http://localhost:3000/descriptionchange",
        {
          id,
          description,
          userTable, // Ensure `userTable` is defined or passed in this function's scope
          currentUserProjectId, // Ensure `currentUserProjectId` is defined or passed in this function's scope
        }
      );

      // Handle the server response, for example, display a success message
      console.log("Issue description updated successfully:", response.data);

      // Optionally, you can return a success message or update the UI
      return response.data.rows; // or update state/UI here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(
        "Error changing issue description:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show a user-friendly message
      alert(
        "There was an error updating the issue description. Please try again."
      );

      // You can also return or throw an error for further handling
      throw error;
    }
  }
  async function handleDesc1Change(id, description) {
    try {
      // Make a POST request to the server with the necessary parameters
      const response = await axios.post(
        "http://localhost:3000/description1change",
        {
          id,
          description,
          userTable, // Ensure `userTable` is defined or passed in this function's scope
          currentUserProjectId, // Ensure `currentUserProjectId` is defined or passed in this function's scope
        }
      );

      // Handle the server response, for example, display a success message
      console.log("Issue description updated successfully:", response.data);

      // Optionally, you can return a success message or update the UI
      return response.data.rows; // or update state/UI here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(
        "Error changing issue description:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show a user-friendly message
      alert(
        "There was an error updating the issue description. Please try again."
      );

      // You can also return or throw an error for further handling
      throw error;
    }
  }
  async function handleFormSubmit(details) {
    try {
      if (details.type == "create") {
        const response = await axios.post(
          "http://localhost:3000/register",
          details
        );
        console.log(response.data);
        setUserTable(response.data.tableName);
        setLogin((prev) => !prev);
      } else {
        const response = await axios.post(
          "http://localhost:3000/login",
          details
        );
        console.log(response.data);
        setSprint(response.data.rows);
        setUserTable(response.data.tableName);
        setProjectList(response.data.rows);
        setLogin((prev) => !prev);
      }
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  }
  async function addProject(projectName) {
    console.log(userTable);
    try {
      const response = await axios.post("http://localhost:3000/submit", {
        projectName: projectName,
        tableName: userTable,
      });
      setProjectList((prev) => [...prev, response.data.item]);
      console.log(response);
      response.data.item.id;
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  }
  return (
    <div>
      {!login && <AuthForm handleFormSubmit={handleFormSubmit} />}
      {login && <Header />}
      {login && !project && (
        <YourWork
          addProject={addProject}
          projectList={projectList}
          handleProjectClick={handleProjectClick}
          userTable={userTable}
        />
      )}
      {backlog && login && project && (
        <Backlog
          key={1}
          handleSprintStarted={handleSprintStarted}
          sprintStarted={sprintStarted}
          handleIssueDelete={handleIssueDelete}
          handleDragIssue={handleDragIssue}
          handleDesc1Change={handleDesc1Change}
          handleDescChange={handleDescChange}
          handleStatusChange={handleStatusChange}
          handleTypeChange={handleTypeChange}
          listOfIssues={currProjectIssues}
          listOfBacklogIssues={currProjectBacklogIssues}
          handleAddIssue1={handleAddIssue1}
          handleAddIssue={handleAddIssue}
          handleSprintSubmit={handleSprintSubmit}
          sprintInfo={sprint.find((ele) => ele.id === currentUserProjectId)}
        />
      )}
      {board && login && project && (
        <Board
          key={2}
          handleIssueDelete={handleIssueDelete}
          handleDesc1Change={handleDesc1Change}
          handleDescChange={handleDescChange}
          handleTypeChange={handleTypeChange}
          handleStatusChange={handleStatusChange}
          handleAddCustomIssue={handleAddCustomIssue}
          issues={sprintStarted ? currProjectIssues : []}
        />
      )}
      {login && (
        <SideBar
          handleBoardChange={async () => {
            try {
              const result = await axios.post(
                "http://localhost:3000/findissues",
                {
                  userTable: userTable,
                  id: currentUserProjectId,
                }
              );
              const issues = result.data.issues;
              const backlogissues = result.data.backlogissues;
              setCurrProjectIssues(issues);
              setCurrProjectBacklogIssues(backlogissues);
            } catch (error) {
              console.error("Error fetching issues:", error);
            }
            setBacklog(false);
            setView(false);
            setReport(false);
            setBoard(true);
            
          }}
          handleBacklogChange={async () => {
            try {
              const result = await axios.post(
                "http://localhost:3000/findissues",
                {
                  userTable: userTable,
                  id: currentUserProjectId,
                }
              );
              const issues = result.data.issues;
              const backlogissues = result.data.backlogissues;
              setCurrProjectIssues(issues);
              setCurrProjectBacklogIssues(backlogissues);
            } catch (error) {
              console.error("Error fetching issues:", error);
            }
            setBoard(false);
            setView(false);
            setReport(false);
            setBacklog(true);
          }}
          handleViewChange={async () => {
            const result1 = await axios.post("http://localhost:3000/view", {
              userTable,
              id: currentUserProjectId,
            });
            const allissue = result1.data.rows;
            setAllIssue(allissue);
            setBoard(false);
            setBacklog(false);
            setReport(false);
            setView(true);
          }}
          handleIssueCount={async () => {
            const result1 = await axios.post(
              "http://localhost:3000/issuecount",
              { userTable, currentUserProjectId }
            );
            const resp = result1.data.rows;
            setIssueCount(resp);
            setBoard(false);
            setBacklog(false);
            setView(false);
            setReport(true);
            console.log(resp);
          }}
          handleHistory={async()=>{
            const result1 = await axios.post(
              "http://localhost:3000/history",
              { userTable, currentUserProjectId }
            );
            const resp = result1.data.rows;
            setHistory(resp);
            setBoard(false);
            setBacklog(false);
            setView(false);
            setReport(true);
            console.log(resp);
          }}
        />
      )}
      {view && login && project && <View allIssue={allIssue} />}
      {report && login && project && <ReportSelector issueCount={issueCount} history={history}/>}
    </div>
  );
}

export default App;
