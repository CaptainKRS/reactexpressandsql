const mysql = require('mysql');
const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 4000;

const mysqlConnection = mysql.createConnection({
  host: '10.9.3.218',
  user: 'TWStudent',
  password: 'TechWorks!',
  database: 'employeedb',
  multipleStatements: true
});

mysqlConnection.connect(err => {
  if (!err) console.log(`DB connection succeded`);
  else {
    console.log(
      `DB connection failed Error: ` + JSON.stringify(err, undefined, 2)
    );
  }
});

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});

//Get all employees
app.get('/employees', (req, res) => {
  mysqlConnection.query('SELECT * FROM employee', (err, rows, field) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//Get an employee
app.get('/employees/:id', (req, res) => {
  mysqlConnection.query(
    'SELECT * FROM Employee WHERE EmpID =?',
    [req.params.id],
    (err, rows, field) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an employee
app.delete('/employees/:id', (req, res) => {
  mysqlConnection.query(
    'DELETE FROM Employee WHERE EmpID =?',
    [req.params.id],
    (err, rows, field) => {
      if (!err) res.send('Deleted Successfully');
      else console.log(err);
    }
  );
});

//Insert an employee
app.post('/employees', (req, res) => {
  let emp = req.body;
  emp.EmpID = 0;
  let sql ='SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
  CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);';
  mysqlConnection.query(
    sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, field) => {
      if (!err) res.json("Added Successfully");
      else console.log(err);
    }
  );
});

//Update an employee
app.put('/employees', (req, res) => {
  let emp = req.body;
  let sql ='SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
  CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);';
  mysqlConnection.query(
    sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, field) => {
      if (!err) res.send("Updated Successfully");
      else console.log(err);
    }
  );
});

