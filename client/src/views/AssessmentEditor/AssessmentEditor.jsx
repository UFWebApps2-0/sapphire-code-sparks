import Question from "./QuestionObj";
import React, { useState } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import "./QuestionFormStyles.css";
import "bootstrap/dist/css/bootstrap.css";

function AssessmentEditor({ assessment, onSave }) {
  const [assessmentData, setAssessmentData] = useState(
    assessment || {
      name: "",
      openDate: "",
      dueDate: "",
      timeLimit: "",
      attempts: "",
      questions: [],
      showGrades: false,
    },
  );
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);

  const addOrUpdateQuestion = (question) => {
    let updatedQuestions = [...assessmentData.questions];

    if (currentQuestionIndex !== null) {
      updatedQuestions[currentQuestionIndex] = question;
    } else {
      updatedQuestions.push(question);
    }

    setAssessmentData({ ...assessmentData, questions: updatedQuestions });
    setShowQuestionForm(false);
    setCurrentQuestionIndex(null);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = assessmentData.questions.filter(
      (_, i) => i !== index,
    );
    setAssessmentData({ ...assessmentData, questions: updatedQuestions });
  };

  const editQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowQuestionForm(true);
  };
  return (
    <>
      <div className="group">
        {/* Form for the assessment details */}
        {/* ... */}
        {showQuestionForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <QuestionForm
                addOrUpdateQuestion={addOrUpdateQuestion}
                question={
                  currentQuestionIndex !== null
                    ? assessmentData.questions[currentQuestionIndex]
                    : new Question()
                }
                closeForm={() => {
                  setCurrentQuestionIndex(null);
                  setShowQuestionForm(false);
                }}
              />
              <button
                className="btn btn-danger"
                onClick={() => setShowQuestionForm(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <form className="group g-3">
          <div className="row">
            <div className="form-group">
              <label className="form-label">Assessment Name:&nbsp;</label>
              <input
                type="text"
                value={assessmentData.name || ""} // Use 'assessmentData' instead of 'data'
                className="form-control"
                placeholder="Enter Assessment Name Here"
                onChange={(e) =>
                  setAssessmentData({ ...assessmentData, name: e.target.value })
                }
                pattern="^[a-zA-Z0-9 _.\-]*$"
              />
            </div>
            <div className="col">
              <div className="form-group">
                <label className="form-label">Open Date: &nbsp;</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={assessmentData.openDate}
                  onChange={(e) => {
                    setData({ ...data, openDate: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="form-label">Due Date: &nbsp;</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={assessmentData.dueDate}
                  onChange={(e) => {
                    setData({ ...data, dueDate: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label className="form-label">{"Time Limit (Minutes): "}</label>

              <div className="col" style={{ paddingLeft: 4 }}>
                <input
                  type="number"
                  className="form-control"
                  value={assessmentData.timeLimit}
                  min="0"
                  max="20000000000"
                  onChange={(e) => {
                    setData({ ...data, timeLimit: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <label className="form-label">{"Attempts: "}</label>

              <div className="col" style={{ paddingLeft: 4 }}>
                <input
                  type="number"
                  className="form-control"
                  value={assessmentData.attempts}
                  min="1"
                  max="999"
                  onChange={(e) => {
                    setData({ ...data, attempts: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div>
              <label className="form-label">
                {"Mute Assessment Results?"}&nbsp;
              </label>

              <input
                type="checkbox"
                value={!assessmentData.showGrades}
                onChange={(e) => {
                  setData({ ...data, showGrades: !e.target.checked });
                }}
              />
            </div>
          </div>
        </form>
        <div>
          <main>
            <div className="group">
              <h1 style={{ marginBottom: 0 }}>
                Questions: {assessmentData.questions.length}
              </h1>
              <h3>Points: {assessmentData.points}</h3>
              <button
                className="btn btn-secondary"
                style={{ margin: "1rem", marginBottom: "0" }}
                onClick={() => {
                  setShowQuestionForm(true);
                }}
              >
                Add New Question
              </button>
              <div
                className="row justify-content-center"
                style={{ height: "70%", overflowY: "auto" }}
              >
                <div className="col-auto">
                  {/** Show questions here */}
                  <QuestionList
                    data={assessmentData.questions}
                    updateSelect={editQuestion} // Pass the index to editQuestion
                    onDelete={removeQuestion}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            // Don't publish
            onSave(data);
            // TODO: Navigate to previous page.
          }}
          style={{ transform: "translate(0%, 0%)" }}
        >
          Save and Finish Later
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const curDate = new Date();
            const res = { ...data, publishDate: curDate.toJSON() };
            onSave(data);
          }}
          style={{ transform: "translate(0%, 0%)" }}
        >
          Save and Publish
        </button>
      </div>
    </>
  );
}

export default AssessmentEditor;
