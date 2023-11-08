// Assessment Workspace Core
import React, { useState } from "react";
import ElaspedTime from "./elapsedTime";
import Submission from "./submission";
import Question from "./QuestionObj";
class Assessment {
  // Construct with an existing object, json string, or nothing.
  constructor(input = null) {
    this.name = "";
    this.attempts = 1;
    this.points = 0.0;
    this.questions = [];
    this.showGrades = false;
    // Set publish date to current date by default.
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1000); // Set 1000 years from now as default publish
    this.publishDate = currentDate.getTime(); // only show after this date/time
    this.openDate = currentDate; // null indicates always open
    this.dueDate = currentDate; // null indicates no deadline.
    this.timeLimit = 9999999; // Negatives indicate unlimited.
    if (input != null) {
      this.update(input);
    }
  }
  // load an existing object as an Assessment from JSON or object.
  update(input) {
    var cur;
    // Check if input is a jSON string or object.
    if (typeof input === "string" || input instanceof String) {
      cur = JSON.parse(input);
    } else {
      cur = input;
    }
    // Update anything that exists.
    if ("name" in cur) {
      this.name = cur.name;
    }
    if ("points" in cur) {
      this.points = cur.points;
    }
    if ("attempts" in cur) {
      this.attempts = cur.attempts;
    }
    if ("questions" in cur && Array.isArray(cur)) {
      for (q in cur) {
        this.addQuestion(new Question(q));
      }
      this.questions = cur.questions;
      this.points = 0.0;
      for (q in this.questions) {
        this.points += q.points;
      }
    }
    if ("showGrades" in cur) {
      this.showGrades = cur.showGrades;
    }
    if ("publishDate" in cur) {
      this.publishDate = cur.publishDate;
    }
    if ("openDate" in cur) {
      this.openDate = cur.openDate;
    }
    if ("dueDate" in cur) {
      this.dueDate = cur.dueDate;
    }
    if ("timeLimit" in cur) {
      this.timeLimit = cur.timeLimit;
    }
  }

  isVisible() {
    // Indicate whether this assessment is visible to students.
    const curDate = new Date();
    return curDate.getTime() >= this.publishDate;
  }
  isOpen() {
    // Indicate whether students can take assessment or not.
    const curDate = new Date();
    return (
      (this.openDate == null || this.openDate <= curDate) &&
      (this.dueDate == null || this.dueDate >= curDate) &&
      (this.publishDate == null || this.publishDate <= curDate)
    );
  }
  save() {
    // TODO: Save this to the database as a new assessment.
    return false;
  }

  addQuestion(q) {
    // Add question to list.
    if (q instanceof Question) {
      this.questions.push(q);
      this.points += q.points;
      return true;
    }
    return false;
  }

  removeQuestion(index) {
    if (index >= this.questions.length) {
      return false;
    }
    this.points -= this.questions[index].points;
    this.choices.splice(index, 1);
    return true;
  }
}
export default App;
