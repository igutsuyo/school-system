"use strict";

const Student = require("../models/student"),
  getStudentParams = body => {
    return {
      name: body.name,
      email: body.email,
      tell: body.tell,
      town: body.town
    };
  };

module.exports = {
  index: (req, res, next) => {
    Student.find()
      .then(students => {
        res.locals.students = students;
        next();
      })
      .catch(error => {
        console.log(`Error fetching students: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("students/index");
  },

  new: (req, res) => {
    res.render("students/new");
  },

  create: (req, res, next) => {
    let studentParams = getStudentParams(req.body);
    Student.create(studentParams)
      .then(student => {
        res.locals.redirect = "/students";
        res.locals.student = student;
        next();
      })
      .catch(error => {
        console.log(`Error saving student: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let studentId = req.params.id;
    Student.findById(studentId)
      .then(student => {
        res.locals.student = student;
        next();
      })
      .catch(error => {
        console.log(`Error fetching student by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("students/show");
  },

  edit: (req, res, next) => {
    let studentId = req.params.id;
    Student.findById(studentId)
      .then(student => {
        res.render("students/edit", {
          student: student
        });
      })
      .catch(error => {
        console.log(`Error fetching student by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let studentId = req.params.id,
          studentParams = getStudentParams(req.body);

          Student.findByIdAndUpdate(studentId, {
      $set: studentParams
    })
      .then(student => {
        res.locals.redirect = `/students/${studentId}`;
        res.locals.student = student;
        next();
      })
      .catch(error => {
        console.log(`Error updating student by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let studentId = req.params.id;
    Student.findByIdAndRemove(studentId)
      .then(() => {
        res.locals.redirect = "/students";
        next();
      })
      .catch(error => {
        console.log(`Error deleting student by ID: ${error.message}`);
        next();
      });
  }
};
