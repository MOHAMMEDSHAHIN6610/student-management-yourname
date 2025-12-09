const express = require("express");
const fs = require("fs");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());

// File path
const filePath = "./data/students.json";

// Helper: read file
function readStudents() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Helper: write file
function writeStudents(students) {
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
}

// ----------------------
// Task 1: ADD NEW STUDENT
// ----------------------
app.post("/api/students", (req, res) => {
  const { name, age, course, year, status } = req.body;

  // VALIDATION
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Name, course, and year are required" });
  }

  if (!age || isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "Age must be a number greater than 0" });
  }

  const students = readStudents();

  const newStudent = {
    id: uuidv4(),
    name,
    age,
    course,
    year,
    status: status || "active"
  };

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// ----------------------
// Task 2: GET ALL STUDENTS
// ----------------------
app.get("/api/students", (req, res) => {
  try {
    const students = readStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Cannot read students.json" });
  }
});

// ----------------------
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

