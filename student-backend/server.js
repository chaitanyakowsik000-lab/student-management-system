const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// MySQL Connection
// ======================

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kowsik@7890',                               
  database: 'studentdb'
});

db.connect((err) => {

  if (err) {
    console.log("❌ Database Connection Failed");
    console.log(err);
    return;
  }

  console.log("✅ MySQL Connected");

});

// ======================
// GET ALL STUDENTS
// ======================

app.get('/students', (req, res) => {

  db.query("SELECT * FROM students", (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

// ======================
// ADD STUDENT
// ======================

app.post('/students', (req, res) => {

  const sql = "INSERT INTO students(name, course) VALUES(?, ?)";

  db.query(
    sql,
    [req.body.name, req.body.course],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Student Added Successfully"
      });

    }
  );

});

// ======================
// UPDATE STUDENT
// ======================

app.put('/students/:id', (req, res) => {

  const sql =
    "UPDATE students SET name=?, course=? WHERE id=?";

  db.query(
    sql,
    [req.body.name, req.body.course, req.params.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Student Updated Successfully"
      });

    }
  );

});

// ======================
// DELETE STUDENT
// ======================

app.delete('/students/:id', (req, res) => {

  db.query(
    "DELETE FROM students WHERE id=?",
    [req.params.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Student Deleted Successfully"
      });

    }
  );

});

// ======================
// START SERVER
// ======================

app.listen(3000, () => {

  console.log("🚀 Server Started on http://localhost:3000");

});