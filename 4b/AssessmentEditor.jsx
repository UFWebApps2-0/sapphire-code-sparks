import "./AssessmentObj";
import "./QuestionObj";
import React from "react";
import Editable from "react-editable-title";
import "./QuesitonList";

function AssessmentEditor({ assessment, onSave }) {
  // Assessment is the object, and onSave is the function to update the assessment in database.
  const [data, setData] = React.useState(assessment);
  const [curQ, setCurQ] = React.useState(new Question());
  const [showAdder, setShowAdder] = React.useState(false);

  function addQ(question = null) {
    setData((prevData) => {
      prevData.addQuestion(question);
      return { prevData };
    });
  }
  return (
    <div>
      {/* Add navbar here*/}
      {
        // TODO: Set this to display new question creator screen.
        showAdder ? (
          <div className="modal">
            <div className="modal_content">
              {/* This shows question editor 
              <QuestionEditor question={new Question()} submit={(q) => {setShowAdder(!showAdder); addQ(q)}} />*/}
            </div>
          </div>
        ) : (
          <></>
        )
      }
      <div className="row">
        <div className="col">
          <h1>Assessment Name: </h1>
        </div>
        <div className="col-6">
          <Editable
            text={`${data.name}`}
            editButton
            editControlButtons
            placeholder="Enter Assessment Name Here"
            inputErrorMessage="No special characters"
            inputErrorMessageStyle={{ color: "blue" }}
            inputPattern="^[a-zA-Z0-9 _.-]*$"
            cb={(val) => setData({ ...data, name: val })}
          />
        </div>
      </div>
      {/* TODO:
      add form to edit the following:
      use time picker: https://mui.com/x/react-date-pickers/date-time-picker/
      this.openDate = null; // null indicates always open
      this.dueDate = null; // null indicates no deadline.
      this.timeLimit = -1;
      this.attempts = 1;    
      this.showGrades = false;
      */}
      <div>
        <button
          className="btn btn-secondary"
          style={{ margin: "1rem", marginBottom: "0" }}
          onClick={() => {
            //setShowAdder(!showAdder);
            alert("This should show adder");
            curQ = new Question();
          }}
        >
          Add New Question
        </button>
        <main>
          <h1>Questions: {data.questions.length}</h1>
          {/** Show questions here */}
          <div style={{ height: "70%", overflowY: "auto" }}>
            <QuestionList
              data={data.questions}
              updateSelect={(q) => {
                setCurQ(q);
                setShowAdder(!showAdder);
              }}
            />
          </div>
        </main>
        <button
          onClick={() => {
            // Don't publish
            onSave(data);
            // TODO: Navigate to previous page.
          }}
        >
          Save and Finish Later
        </button>
        <button
          onClick={() => {
            const curDate = new Date();
            if (data.publishDate > curDate) {
              setData({ ...data, publishDate: curDate });
            }
            onSave(data);
            // TODO: Navigate to previous page.
          }}
        >
          Save and Publish
        </button>
      </div>
    </div>
  );
}

export default AssessmentEditor;
