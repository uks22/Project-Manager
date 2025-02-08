import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import axios from "axios";
const saltRounds = 10;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
const port = 3000;
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "agile",
  password: "ujjwals@2004",
  port: 5432,
});

db.connect();
app.get("/notes", async (req, res) => {
  const { tableName } = req.query;
  console.log(tableName);
  const result = await db.query(`SELECT * from ${tableName}`);
  const result1 = await db.query(`SELECT * from ${tableName}activetasks`);
  const result2 = await db.query(`SELECT * from ${tableName}completedtasks`);
  console.log(result.rows);
  res.status(201).json({
    message: "Sent notes",
    item: result.rows,
    item1: result1.rows,
    item2: result2.rows,
  });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      console.log("error1");
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Manually log the user in
      req.login(user, async (err) => {
        const tableName = email.replace("@", "_").replace(".", "_");
        const response = await db.query(`SELECT * FROM ${tableName}`); //true means it belongs to sprint false means it belongs to backlog
        console.log(response);
        return res.status(200).json({
          message: "Login successful",
          user: user,
          tableName: tableName,
          rows: response.rows,
        });
      });
    } else {
      console.log("error");
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
  } catch (error) {
    console.error("Error while logging in:", error);
  }
}); // Redirect on failure
app.get("/login", (req, res) => {
  console.log("fail");
});
app.get("/profile", (req, res) => {
  console.log(req.body);
});
app.post("/submit", async (req, res) => {
  const { projectName, tableName } = req.body;

  try {
    // Inserting the data into the database using SQL
    const result = await db.query(
      `INSERT INTO ${tableName} (project_name) VALUES ($1) RETURNING *`,
      [projectName]
    );
    const projectTablename = (tableName + " " + projectName)
      .trim()
      .replace(/\s+/g, "_");
    const result1 = await db.query(
      `CREATE TABLE ${projectTablename} (
      id SERIAL PRIMARY KEY,     
      issue_desc TEXT,           
      issue_desc1 TEXT,        
      issue_type VARCHAR(255), 
      issue_status VARCHAR(255),  
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
      modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_sprint BOOLEAN DEFAULT TRUE,
      sprint_name VARCHAR(255)
      );`
    );
    const result2 = await db.query(
      `CREATE TABLE ${projectTablename}_issue_count (
      id SERIAL PRIMARY KEY,   
      todo INT DEFAULT 0,                  
      in_progress INT DEFAULT 0,         
      done INT DEFAULT 0,                
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP                        
      );`
    );
    const result3 = await db.query(
      `CREATE TABLE ${projectTablename}_history (
        id SERIAL PRIMARY KEY,   
        logs VARCHAR(255),  
        time_record TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      );`
    );
    const result4 = await db.query(
      `INSERT INTO ${projectTablename}_history (logs)
       VALUES ($1)`,
      [`created project: ${projectName}`] // Using parameterized query to safely insert the log
    );
    // Return the inserted item as a response
    res.status(201).json({
      message: "Item successfully added",
      item: result.rows[0], // The inserted item data
    });
  } catch (err) {
    console.error("Error inserting data", err.stack);
    res.status(500).json({ message: "Error inserting data" });
  }
});
app.post("/submitsprint", async (req, res) => {
  // Extract the data from the request body
  const { sprintDetails, currentUserProjectId, userTable, prevName } = req.body;
  const { sprintName, startDate, endDate, sprintGoal } = sprintDetails;
  console.log(prevName);
  // Construct the SQL query (without parameterized dynamic table name)
  const query = `
    UPDATE ${userTable} 
    SET sprint_created = true, 
        sprint_name = '${sprintName}', 
        start_date = '${startDate}', 
        end_date = '${endDate}', 
        sprint_goal = '${sprintGoal}' 
    WHERE id = ${currentUserProjectId}
    RETURNING *
  `;

  try {
    // Assuming you have a db connection set up (e.g., MySQL using mysql2 package)
    const response1 = await db.query(query);
    console.log(response1);
    const response = await db.query(`SELECT * FROM ${userTable}`);
    console.log("Sprint details updated successfully.");
    //  const response = await db.query(`UPDATE `)
    const rows = response.rows;
    const projectName = response1.rows[0].project_name;

    // Step 3: Safely create the table name by sanitizing the project name
    // Use a simple approach to sanitize the table name to avoid SQL injection
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores
    // Responding with status 200 (OK) since the resource was updated successfully
    const response2 = await db.query(
      `UPDATE ${projectTablename} 
       SET sprint_name = $1 
       WHERE sprint_name = $2`,
      [sprintName, prevName]
    );
    const response3 = await db.query(
      `INSERT INTO ${projectTablename}_history
       (logs) 
       VALUES ($1)`,
      [`Updated sprint name from ${prevName} to ${sprintName}`]
    );

    res.status(200).json({
      message: "Sprint details updated successfully.",
      rows: rows,
    });
  } catch (error) {
    // Log the error and send a response with status 500 (Internal Server Error)
    console.error("Error updating sprint details:", error);
    res.status(500).json({ message: "Error updating sprint details." });
  }
});

app.post("/submitcompleted", async (req, res) => {
  const { content, tableName } = req.body;

  try {
    // Inserting the data into the database using SQL
    const result = await db.query(
      `INSERT INTO ${tableName}completedtasks (content) VALUES ($1) RETURNING *`,
      [content]
    );

    // Return the inserted item as a response
    res.status(201).json({
      message: "Item successfully added",
      item: result.rows[0], // The inserted item data
    });
  } catch (err) {
    console.error("Error inserting data", err.stack);
    res.status(500).json({ message: "Error inserting data" });
  }
});
app.post("/submitissue", async (req, res) => {
  const { desc, userTable, currentUserProjectId, sprint_name } = req.body;

  try {
    // Step 1: Query the user table for the project based on the provided ID
    const result = await db.query(`SELECT * FROM ${userTable} WHERE id = $1`, [
      currentUserProjectId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Step 2: Extract the project name from the result
    const projectName = result.rows[0].project_name;

    // Step 3: Safely create the table name by sanitizing the project name
    // Use a simple approach to sanitize the table name to avoid SQL injection
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Step 4: Insert issue into the dynamic project table
    const result1 = await db.query(
      `INSERT INTO ${projectTablename} (issue_desc, issue_type, issue_status, sprint_name) VALUES ($1, $2, $3, $4) RETURNING *`,
      [desc, "1", "To-Do", sprint_name]
    );
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["To-Do"]
    );
    const result3 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["In Progress"]
    );
    const result4 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["Done"]
    );
    console.log(result2);

    await db.query(
      `INSERT INTO ${projectTablename}_issue_count (todo,in_progress,done,date)
        VALUES ($1,$2,$3,CURRENT_TIMESTAMP)`,
      [result2.rows.length, result3.rows.length, result4.rows.length]
    );
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [`created issue: ${desc} for sprint: ${sprint_name}`] // The log message with dynamic variables
    );
    // Step 5: Respond with success
    res
      .status(200)
      .json({ message: "Issue submitted successfully", rows: result1.rows });
  } catch (error) {
    console.error("Error submitting issue:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the issue" });
  }
});
app.post("/submitcustomissue", async (req, res) => {
  const { desc, userTable, currentUserProjectId, status, sprint_name } =
    req.body;

  try {
    // Step 1: Query the user table for the project based on the provided ID
    const result = await db.query(`SELECT * FROM ${userTable} WHERE id = $1`, [
      currentUserProjectId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Step 2: Extract the project name from the result
    const projectName = result.rows[0].project_name;

    // Step 3: Safely create the table name by sanitizing the project name
    // Use a simple approach to sanitize the table name to avoid SQL injection
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Step 4: Insert issue into the dynamic project table
    const result1 = await db.query(
      `INSERT INTO ${projectTablename} (issue_desc, issue_type, issue_status,sprint_name) VALUES ($1, $2, $3,$4) RETURNING *`,
      [desc, "1", status, sprint_name]
    );
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["To-Do"]
    );
    const result3 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["In Progress"]
    );
    const result4 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["Done"]
    );
    console.log(result2);

    await db.query(
      `INSERT INTO ${projectTablename}_issue_count (todo,in_progress,done,date)
        VALUES ($1,$2,$3,CURRENT_TIMESTAMP)`,
      [result2.rows.length, result3.rows.length, result4.rows.length]
    );
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [
        `created issue: ${desc}, for sprint: ${sprint_name}, of status: ${status}`,
      ] // The log message with dynamic variables
    );
    // Step 5: Respond with success
    res
      .status(200)
      .json({ message: "Issue submitted successfully", rows: result1.rows });
  } catch (error) {
    console.error("Error submitting issue:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the issue" });
  }
});
app.post("/submitbacklogissue", async (req, res) => {
  const { desc, userTable, currentUserProjectId } = req.body;

  try {
    // Step 1: Query the user table for the project based on the provided ID
    const result = await db.query(`SELECT * FROM ${userTable} WHERE id = $1`, [
      currentUserProjectId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Step 2: Extract the project name from the result
    const projectName = result.rows[0].project_name;

    // Step 3: Safely create the table name by sanitizing the project name
    // Use a simple approach to sanitize the table name to avoid SQL injection
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Step 4: Insert issue into the dynamic project table
    const result1 = await db.query(
      `INSERT INTO ${projectTablename} (issue_desc, issue_type, issue_status, is_sprint) VALUES ($1, $2, $3, $4) RETURNING *`,
      [desc, "1", "To-Do", false]
    );
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["To-Do"]
    );
    const result3 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["In Progress"]
    );
    const result4 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["Done"]
    );
    console.log(result2);

    await db.query(
      `INSERT INTO ${projectTablename}_issue_count (todo,in_progress,done,date)
        VALUES ($1,$2,$3,CURRENT_TIMESTAMP)`,
      [result2.rows.length, result3.rows.length, result4.rows.length]
    );
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [`created issue: ${desc}, in backlog`] // The log message with dynamic issue description
    );

    // Step 5: Respond with success
    res
      .status(200)
      .json({ message: "Issue submitted successfully", rows: result1.rows });
  } catch (error) {
    console.error("Error submitting issue:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the issue" });
  }
});
app.post("/findissues", async (req, res) => {
  const { userTable, id } = req.body;

  try {
    // Step 1: Query the user table to find the project
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [id] // Parameterized query to prevent SQL injection for id
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    const sprint_started = result.rows[0].sprint_started;
    // Step 2: Extract the project name from the result
    const projectName = result.rows[0].project_name;

    // Step 3: Sanitize the table name (avoid any malicious table name)
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Step 4: Query the project-specific table for issues
    const result1 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE is_sprint = TRUE`
    );
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE is_sprint = FALSE`
    );

    if (result1.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No issues found for this project" });
    }

    // Step 5: Return the rows from the project table
    res.status(200).json({
      issues: result1.rows,
      backlogissues: result2.rows,
      sprint_started: sprint_started,
    });
  } catch (error) {
    console.error("Error finding issues:", error);
    res.status(500).json({ error: "An error occurred while fetching issues" });
  }
});
app.post("/handlesprintstart", async (req, res) => {
  const { userTable, currentUserProjectId, val } = req.body; // Get table name and the new value for sprint_started

  try {
    // Convert val to boolean (assuming it's either "true" or "false")

    const sprintStarted = val;

    // Construct your query dynamically
    const query = `
      UPDATE ${userTable}
      SET sprint_started = $1
      WHERE id = $2`; // Adjust the WHERE clause as per your requirement
    const result1 = await db.query(`SELECT * FROM ${userTable} WHERE id = $1`, [
      currentUserProjectId,
    ]);
    if (result1.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result1.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores
    const sprint_name = result1.rows[0].sprint_name;
    const prev_sprint_status = result1.rows[0].sprint_started;
    if (sprintStarted != prev_sprint_status) {
      if (sprintStarted == true) {
        await db.query(
          `INSERT INTO ${projectTablename}_history (logs) 
           VALUES ($1)`,
          [`sprint ${sprint_name}: started`] // The log message with dynamic variables
        );
      }
    }

    // Execute the query using db.query
    const result = await db.query(query, [sprintStarted, currentUserProjectId]); // Use proper parameter values like '1' for the ID or adjust as needed

    // Check the result of the query
    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: "Sprint start status updated successfully!" });
    } else {
      res.status(404).json({
        message: "No rows updated. Check if the table or condition is correct.",
      });
    }
  } catch (error) {
    console.error("Error updating sprint status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/typechange", async (req, res) => {
  const { id, type, userTable, currentUserProjectId } = req.body;

  try {
    // First, fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE id = $1`,
      [id]
    );
    const prevType = result2.rows[0].issue_type;
    // Update the issue type in the project-specific table
    const result1 = await db.query(
      `UPDATE ${projectTablename} SET issue_type = $1, modified = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [type, id] // Parameterized query to prevent SQL injection
    );
    if (prevType != type) {
      await db.query(
        `INSERT INTO ${projectTablename}_history (logs) 
         VALUES ($1)`,
        [`issue id ${id}: changed type from ${prevType} to ${type}`] // Log message with dynamic values
      );
    }
    console.log(result1);
    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not updated" });
    }

    // Return a success message
    res.json({
      message: "Issue type updated successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/issuecount", async (req, res) => {
  const { userTable, currentUserProjectId } = req.body;
  try {
    // First, fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Update the issue type in the project-specific table
    const result1 = await db.query(
      `SELECT * FROM ${projectTablename}_issue_count`
    );
    console.log(result1);
    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "table of issue_count not found" });
    }

    // Return a success message
    res.json({
      message: "Issue counted successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/history", async (req, res) => {
  const { userTable, currentUserProjectId } = req.body;
  try {
    // First, fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Query the project-specific history table
    const result1 = await db.query(`SELECT * FROM ${projectTablename}_history`);
    console.log(result1);
    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "History table not found" });
    }

    // Return a success message with the history data
    res.json({
      message: "History fetched successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/view", async (req, res) => {
  const { userTable, id } = req.body;
  const response = await db.query(`SELECT * FROM ${userTable} WHERE id = $1`, [
    id,
  ]);
  const projectName = response.rows[0].project_name;
  const projectTablename = (userTable + "_" + projectName)
    .trim()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores
  const response1 = await db.query(`SELECT * FROM ${projectTablename}`);
  console.log(response1);
  res.json({ rows: response1.rows });
});
app.post("/statuschange", async (req, res) => {
  const { id, status, userTable, currentUserProjectId } = req.body;

  try {
    // Fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Fetch the current issue status before updating it
    const currentStatusResult = await db.query(
      `SELECT issue_status,issue_desc FROM ${projectTablename} WHERE id = $1`,
      [id] // Parameterized query to prevent SQL injection
    );

    if (currentStatusResult.rows.length === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const currentStatus = currentStatusResult.rows[0].issue_status;
    const desc = currentStatusResult.rows[0].issue_desc;
    const result1 = await db.query(
      `UPDATE ${projectTablename} SET issue_status = $1, modified = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id] // Parameterized query to prevent SQL injection
    );
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [`changed status of issue: ${desc}, from ${currentStatus} to ${status}`] // Log message with dynamic values
    );

    // If the status has changed, update the issue count table
    if (currentStatus !== status) {
      // First, get the current count from the issue count table
      const result2 = await db.query(
        `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
        ["To-Do"]
      );
      const result3 = await db.query(
        `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
        ["In Progress"]
      );
      const result4 = await db.query(
        `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
        ["Done"]
      );
      console.log(result2);

      await db.query(
        `INSERT INTO ${projectTablename}_issue_count (todo,in_progress,done,date)
          VALUES ($1,$2,$3,CURRENT_TIMESTAMP)`,
        [result2.rows.length, result3.rows.length, result4.rows.length]
      );
    }

    // Update the issue status in the project-specific table

    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not updated" });
    }

    // Return a success message
    res.json({
      message: "Issue status updated successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/descriptionchange", async (req, res) => {
  const { id, description, userTable, currentUserProjectId } = req.body;

  try {
    // Fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE id = $1`,
      [id]
    );
    // Update the issue description in the project-specific table
    const result1 = await db.query(
      `UPDATE ${projectTablename} SET issue_desc = $1, modified = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [description, id] // Parameterized query to prevent SQL injection
    );
    const prevDesc = result2.rows[0].issue_desc;
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [`changed description of issue from '${prevDesc}' to '${description}'`] // Log message with dynamic values
    );

    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not updated" });
    }

    // Return a success message
    res.json({
      message: "Issue description updated successfully",
      rows: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/dragissue", async (req, res) => {
  console.log("hello");
  const { id, is_sprint, userTable, currentUserProjectId } = req.body;
  console.log(req.body);
  try {
    // Fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Update the issue's 'is_sprint' field in the project-specific table
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE id = $1`,
      [id]
    );
    const prevStatus = result2.rows[0].is_sprint;
    const desc = result2.rows[0].issue_desc;
    const result1 = await db.query(
      `UPDATE ${projectTablename} SET is_sprint = $1, modified = CURRENT_TIMESTAMP WHERE id = $2`,
      [is_sprint, id] // Parameterized query to prevent SQL injection
    );
    if (prevStatus != is_sprint) {
      if (is_sprint == true) {
        await db.query(
          `INSERT INTO ${projectTablename}_history (logs) 
           VALUES ($1)`,
          [`issue desc: ${desc}, move from Backlog to Sprint`] // Log message with dynamic values
        );
      } else {
        await db.query(
          `INSERT INTO ${projectTablename}_history (logs) 
           VALUES ($1)`,
          [`issue desc: ${desc}, move from Sprint to Backlog`] // Log message with dynamic values
        );
      }
    }
    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not updated" });
    }

    // Fetch two tables of issues:
    // 1. Issues where is_sprint = true
    // 2. Issues where is_sprint = false
    const sprintIssues = await db.query(
      `SELECT * FROM ${projectTablename} WHERE is_sprint = true`
    );
    const nonSprintIssues = await db.query(
      `SELECT * FROM ${projectTablename} WHERE is_sprint = false`
    );

    // Return both sets of issues as part of the response
    res.json({
      message: "Issue sprint status updated successfully",
      sprintIssues: sprintIssues.rows, // Issues that are in the sprint
      backlogIssues: nonSprintIssues.rows, // Issues that are not in the sprint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/description1change", async (req, res) => {
  const { id, description, userTable, currentUserProjectId } = req.body;

  try {
    // Fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Update the issue description in the project-specific table
    const result1 = await db.query(
      `UPDATE ${projectTablename} SET issue_desc1 = $1, modified = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [description, id] // Parameterized query to prevent SQL injection
    );

    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not updated" });
    }

    // Return a success message
    res.json({
      message: "Issue description updated successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const tableName = req.query.tableName;
  try {
    console.log("hello");
    const result = await db.query(
      `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Note deleted successfully",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }
  } catch (err) {
    console.error("Error deleting note:", err.stack);
    res.status(500).json({
      status: "error",
      message: "Error deleting note",
    });
  }
});
app.delete("/deleteissue", async (req, res) => {
  const { id, userTable, currentUserProjectId } = req.query;

  try {
    // Fetch the project name from the user table based on the project ID
    const result = await db.query(
      `SELECT * FROM ${userTable} WHERE id = $1`,
      [currentUserProjectId] // Parameterized query to prevent SQL injection
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectName = result.rows[0].project_name;
    const projectTablename = (userTable + "_" + projectName)
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove any non-alphanumeric characters except underscores

    // Get the current status of the issue to be deleted (for counting purposes)
    const currentStatusResult = await db.query(
      `SELECT issue_status FROM ${projectTablename} WHERE id = $1`,
      [id] // Parameterized query to prevent SQL injection
    );

    if (currentStatusResult.rows.length === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const currentStatus = currentStatusResult.rows[0].issue_status;

    // Delete the issue from the project-specific table
    const result1 = await db.query(
      `DELETE FROM ${projectTablename} WHERE id = $1 RETURNING *`,
      [id] // Parameterized query to prevent SQL injection
    );
    const result2 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["To-Do"]
    );
    const result3 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["In Progress"]
    );
    const result4 = await db.query(
      `SELECT * FROM ${projectTablename} WHERE issue_status = $1`,
      ["Done"]
    );
    console.log(result2);

    await db.query(
      `INSERT INTO ${projectTablename}_issue_count (todo,in_progress,done,date)
        VALUES ($1,$2,$3,CURRENT_TIMESTAMP)`,
      [result2.rows.length, result3.rows.length, result4.rows.length]
    );
    if (result1.rowCount === 0) {
      return res.status(404).json({ error: "Issue not found or not deleted" });
    }
    await db.query(
      `INSERT INTO ${projectTablename}_history (logs) 
       VALUES ($1)`,
      [`Deleted issue with id no. ${id}`] // Log message with dynamic values
    );
    // Return a success message
    res.json({
      message: "Issue deleted successfully",
      rows: result1.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  try {
    // Check if the email already exists in the database
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      // If the email already exists, send an appropriate response to the client
      res.status(400).send("Email already exists. Try logging in.");
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          res.status(500).send("Error hashing password");
        } else {
          // Insert the new user into the users table
          const result = await db.query(
            "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *",
            [email, username, hash]
          );

          // Sanitize the email to create a valid table name
          const tableName = email.replace("@", "_").replace(".", "_"); // Example of sanitizing the email for table name

          // Create a new table for this user
          const query = `CREATE TABLE ${tableName} (
            id SERIAL PRIMARY KEY,
            project_name VARCHAR(255) NOT NULL UNIQUE,
            sprint_created BOOLEAN DEFAULT FALSE,
            sprint_name VARCHAR(255),       
            start_date DATE,
            end_date DATE,
            sprint_goal TEXT,
            sprint_started BOOLEAN DEFAULT FALSE               
        )`;

          try {
            // Execute the query to create the table
            await db.query(query);
          } catch (err) {
            console.error("Error creating table:", err);
            return res.status(500).send("Error creating user-specific table");
          }

          // Get the newly created user from the result
          const user = result.rows[0];

          // Send the user data and the table name back in the response
          console.log(user);
          res.status(200).send({
            user: user, // User details
            tableName: tableName, // The dynamically created table name
          });

          // Log in the user (set up session or JWT if needed)
          req.login(user, (err) => {
            if (err) {
              console.error("Error during login:", err);
            } else {
              console.log("User logged in successfully");
            }
          });
        }
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error during registration");
  }
});
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      message: "success",
    });
  });
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    console.log(username + " " + password);
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
