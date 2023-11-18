import Question from "../../Utils/QuestionObj";
import React from "react";
import QuestionList from "../../../../4b/QuestionList";
import "bootstrap/dist/css/bootstrap.css";

function AssessmentEditor({ data, setData, onSave }) {
  // Assessment is the object, and onSave is the function to update the assessment in database.
  //const [data, setData] = React.useState(assessment);
  const [curQ, setCurQ] = React.useState(new Question());
  const [showAdder, setShowAdder] = React.useState(false);

  function addQ(question = null) {
    setData((prevData) => {
      prevData.addQuestion(question);
      return { prevData };
    });
  }
  function removeQ(id) {
    if (id) {
      setData({
        ...data,
        questions: data.questions.splice(id, 1),
      });
    }
  }
  return (
    <>
      <div className="group">
        {
          // TODO: Set this to display new question creator screen.
          showAdder ? (
            // Absolute position and zIndex make it appear as a popup in front of everything else.
            <div
              className="modal"
              style={{ position: "absolute", zIndex: 99999 }}
            >
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
            <div className="form-group">
              <label className="form-label">Assessment Name:&nbsp;</label>
              <input
                type="text"
                value={`${data.name}`}
                className="form-control"
                placeholder="Enter Assessment Name Here"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                pattern="^[a-zA-Z0-9 _.\-]*$"
              />
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
            <div>
              <label className="form-label">
                {"Mute Assessment Results?"}&nbsp;
              </label>

              <input
                type="checkbox"
                value={!data.showGrades}
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
                Questions: {data.questions.length}
              </h1>
              <h3>Points: {data.points}</h3>
              <button
                className="btn btn-secondary"
                style={{ margin: "1rem", marginBottom: "0" }}
                onClick={() => {
                  //setShowAdder(!showAdder);
                  alert("This should show adder");
                  setCurQ(new Question());
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
                    data={data.questions}
                    updateSelect={(q) => {
                      setCurQ(q);
                      setShowAdder(!showAdder);
                    }}
                    onDelete={() => {
                      const res = confirm("Permanently delete this question?");
                      if (res) {
                        // IF we delete,
                        message.success("Question Deleted");
                      }
                    }}
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
