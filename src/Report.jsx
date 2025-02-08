import React, { useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js"; // Import chart.js core and registerable components
import "chartjs-adapter-date-fns"; // Import chartjs date-fns adapter
import { useState } from "react";

// Example data

const Report = (props) => {
  const [chart, setChart] = useState(null);
  const sampleData = props.issueCount;
  console.log(props.issueCount);
  useEffect(() => {
    // Register Chart.js components required for this chart
    ChartJS.register(...registerables); // Register all components

    // Prepare the data for the chart
    const labels = sampleData.map((item) => new Date(item.date)); // Convert string to Date objects
    const todoData = sampleData.map((item) => item.todo);
    const inProgressData = sampleData.map((item) => item.in_progress);
    const doneData = sampleData.map((item) => item.done);
    const totalData = sampleData.map(
      (item) => item.todo + item.in_progress + item.done
    );

    const chartData = {
      labels: labels, // Use timestamps as labels
      datasets: [
        {
          label: "To-Do",
          data: todoData,
          borderColor: "#FF6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0,
        },
        {
          label: "In-Progress",
          data: inProgressData,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
          tension: 0,
        },
        {
          label: "Done",
          data: doneData,
          borderColor: "#FFCE56",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          fill: true,
          tension: 0,
        },
        {
          label: "Total",
          data: totalData,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0,
        },
      ],
    };

    const chartConfig = {
      type: "line", // Set the chart type
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Issue Status Count Over Time",
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
          },
        },
        scales: {
          x: {
            type: "time", // Set x-axis to display time
            time: {
              unit: "minute", // You can change this to 'hour', 'day', etc. depending on your data
              displayFormats: {
                minute: "MMM dd, yyyy HH:mm", // Format the x-axis labels to show both date and time
                hour: "MMM dd, yyyy HH:mm",
                day: "MMM dd, yyyy", // Change format for daily ticks
              },
              tooltipFormat: "MMM dd, yyyy HH:mm", // Fix the tooltip format string
            },
            title: {
              display: true,
              text: "Date & Time",
            },
            ticks: {
              source: "auto", // Automatically determine the best tick placement
              autoSkip: true,
              maxRotation: 45, // Rotate labels if necessary to fit
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Issue Count",
            },
          },
        },
      },
    };

    // Get the canvas context and create the chart
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new ChartJS(ctx, chartConfig);
    setChart(myChart);

    // Cleanup the chart instance when the component unmounts
    return () => {
      if (myChart) myChart.destroy();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    
        borderRadius: "40px",
      }}
    >
      <div
        style={{
          
          width: "80%",
          maxWidth: "1200px",
          borderRadius: "40px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Issue Status Count Over Time</h2>
        <canvas style={{ borderRadius: "40px" }} id="myChart"></canvas>
      </div>
    </div>
  );
};

export default Report;
