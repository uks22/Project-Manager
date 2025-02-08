import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const History = (props) => {
  // State for issue counts
  const todo=props.issueCount[props.issueCount.length-1].todo;
  const inprogress=props.issueCount[props.issueCount.length-1].in_progress;
  const done=props.issueCount[props.issueCount.length-1].done;
  const [toDoCount, setToDoCount] = useState(parseInt(todo,10));
  const [inProgressCount, setInProgressCount] = useState(parseInt(inprogress,10));
  const [doneCount, setDoneCount] = useState(parseInt(done,10));
  const [history, setHistSory] = useState(props.history);
  const [action, setAction] = useState("add");
  const [details, setDetails] = useState("");

  // Compute total count
  const totalCount = toDoCount + inProgressCount + doneCount;

  // Chart data
  const chartData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [toDoCount, inProgressCount, doneCount],
        backgroundColor: ["#ff0000", "#ffcc00", "#4caf50"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    cutoutPercentage: 60,
    rotation: -90,
    circumference: 360,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    onHover: function (event, chartElement) {
      const centerText = document.getElementById("centerText");
      if (chartElement.length) {
        const index = chartElement[0].index;
        const category = chartData.labels[index];
        const count = chartData.datasets[0].data[index];
        centerText.innerHTML = `${category}<br> ${count}`;
      } else {
        centerText.innerHTML = `Total Issues<br>${totalCount}`;
      }
    },
  };

  // Handle form submit
  const logChange = () => {
    if (!details.trim()) {
      alert("Please enter the details.");
      return;
    }

    let changeMessage = "";
    let updateChart = false;

    switch (action) {
      case "add":
        changeMessage = `Added new issue: ${details}`;
        break;
      case "type":
        changeMessage = `Changed issue type: ${details}`;
        break;
      case "status":
        const newStatus = details.toLowerCase().trim();
        changeMessage = `Changed issue status: ${details}`;
        if (newStatus === "to do") {
          setToDoCount((prev) => prev + 1);
          updateChart = true;
        } else if (newStatus === "in progress") {
          setInProgressCount((prev) => prev + 1);
          updateChart = true;
        } else if (newStatus === "done") {
          setDoneCount((prev) => prev + 1);
          updateChart = true;
        }
        break;
      default:
        changeMessage = "Unknown action";
    }

    // Add change message to history
    setHistory((prevHistory) => [...prevHistory, changeMessage]);

    // Update the pie chart if the status is changed
    if (updateChart) {
      setToDoCount(toDoCount);
      setInProgressCount(inProgressCount);
      setDoneCount(doneCount);
    }

    // Clear input field after logging the change
    setDetails("");
  };

  return (
    <div className="historycontainer">
      <div id="pieChartContainer">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="centerText" id="centerText">
          Total Issues
        </div>
      </div>

      <div className="historyform">
        
        <h2>Change History</h2>
        <div className="history-container">
  
            {history.map((ele) => (
              <div key={ele.id} className="history-item">{ele.logs}</div>
            ))}

        </div>
      </div>
    </div>
  );
};

export default History;
