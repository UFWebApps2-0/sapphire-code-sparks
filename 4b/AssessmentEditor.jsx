import "./AssessmentObj";
import "./QuestionObj";
import React from "react";
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
      <form className="group g-3">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label className="form-label">Assessment Name:&nbsp;</label>
              <input
                type="text"
                text={`${data.name}`}
                className="form-control"
                placeholder="Enter Assessment Name Here"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                pattern="^[a-zA-Z0-9 _.-]*$"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="form-label">Open Date: &nbsp;</label>
              <input
                type="datetime-local"
                className="form-control"
                value={data.openDate}
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
                value={data.dueDate}
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
                value={data.timeLimit}
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
                value={data.attempts}
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
          <div className="row">
            <label className="form-label">{"Mute Assessment Results?"}</label>
            <input
              type="checkbox"
              className="form-control"
              value={!data.showGrades}
              onChange={(e) => {
                setData({ ...data, showGrades: !e.target.checked });
              }}
            />
          </div>
        </div>
      </form>
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
