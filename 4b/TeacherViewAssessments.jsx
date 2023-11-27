import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherViewAssessments.css";
import "../client/src/Utils/requests";
import NavBar from "../client/src/components/NavBar/NavBar";
import { getAssessments } from "../client/src/Utils/requests";
import message from "../client/src/components/Message";

function TeacherViewAssessments() {
  const [assessmentList, setAssessmentList] = React.useState({});
  const handleAdd = () => {
    //Create a new entry in the database
    //Navigate to the editor of that entry.
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAssessments();
        return res.data;
      } catch {
        return { err: "Data fetch failed" };
      }
    };
    fetchData().then((res) => {
      if (res) {
        setAssessmentList(res); //Whatever the react state for the assessment is.
      } else {
        message.error(res.err);
        const navigate = useNavigate();
        navigate("/PageNotFound");
      }
    });
  }, []);
  return (
  <main className="background">
    <div>
      <div id="main-header">
        {" "}
        <br></br>View Assessments
      </div>
      <NavBar />
      <div className="projectText">
        <p className="tableTop bold">Assessments:</p>
        <PrintMiddleEntries assessmentList={assessmentList} />
        <div>
          <button onClick={() => HandleAdd()} className="alignRight button2">
            Create New<br></br>Assignment
          </button>
          <br></br>
        </div>
      </div>
    </div>
  </main>
  );
}

function PrintMiddleEntries(assessmentList) {
  const navigate = useNavigate();
  if (assessmentList !== undefined && Array.isArray(assessmentList.assessmentList)) {
    return (
      <div className = "background">
        {assessmentList.assessmentList.map((directory) => (
          <div className="tableMid">
            <div className="alignLeft bold">{directory.name} <br></br> <div className="noBold"> Assigned: <PrintDate directoryDate={directory.openDate}/> | Due: <PrintDate directoryDate={directory.dueDate}/></div></div>
            <button onClick={() => navigate("/about")} className="shortenTransform1 alignRight">
              Assign
            </button>
            <button onClick={() => navigate("/teacher-assessments/editor/" + directory.id)} className="shortenTransform2 alignRight">
              Edit
            </button>
            <button onClick={() => navigate("Grade")} className="shortenTransform3 alignRight">
              Grade
            </button>
            <br></br>
          </div>
        ))}
      </div>
    );
  }
}

function PrintDate({directoryDate}) {
  return directoryDate.substring(0, directoryDate.indexOf("T"))
}

export default TeacherViewAssessments;
