import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "ujjwals@2004",
  port: 5432,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();


app.post("/submit", (req, res) => {
  const item = req.body
  console.log(item);
});

app.post("/edit", (req, res) => {
    db.query("UPDATE items SET title = ($1) WHERE id = ($2)",[req.body.updatedItemTitle,req.body.updatedItemId]);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
  db.query("DELETE FROM items WHERE id = ($1)",[req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
