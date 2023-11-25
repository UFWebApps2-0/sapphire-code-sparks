import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherViewAssessments.css";
import "../client/src/Utils/requests";
import NavBar from "../client/src/components/NavBar/NavBar";
import { getAssessments } from "../client/src/Utils/requests";
import message from "../client/src/components/Message";
//import { dir } from "tmp";

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
    <div className="background">
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
        </div>
      </div>
    </div>
  );
}
function PrintMiddleEntries(assessmentList) {
  const navigate = useNavigate();
  const sampleList = [
    "Red and Blue",
    "Yellow",
    "Gold and Silver",
    "Crystal",
    "Ruby and Sapphire",
    "FireRed and LeafGreen",
    "Emerald",
    "Diamond and Pearl",
    "Platinum",
    "HeartGold and SoulSilver",
    "Black and White",
    "Black 2 and White 2",
    "X and Y",
    "Omega Ruby and Alpha Sapphire",
    "Sun and Moon",
    "Ultra Sun and Ultra Moon",
    "Let's Go, Pikachu! and Let's Go, Eevee!",
    "Sword and Shield",
    "The Isle of Armor (DLC)",
    "The Crown Tundra (DLC)",
    "Brilliant Diamond and Shining Pearl",
    "Legends: Arceus",
    "Scarlet and Violet",
    "The Teal Mask (DLC)",
    "The Indigo Disk (DLC)",
  ]; // Can replace with database

  if (
    assessmentList !== undefined &&
    Array.isArray(assessmentList.assessmentList)
  ) {
    return (
      // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
      <div>
        {assessmentList.assessmentList.map((directory) => (
          <div className="tableMid">
            <p className="alignLeft bold">{directory.name}</p>
            <p>
              <br></br>Assigned: {directory.openDate} | Due: {directory.dueDate}
            </p>
            <button onClick={() => navigate("Grade")} className="alignRight">
              Grade
            </button>
            <button
              onClick={() =>
                navigate("/teacher-assessments/editor/" + directory.id)
              }
              className="alignRight shortenTransform"
            >
              Edit
            </button>
            <button
              onClick={() => navigate("/about")}
              className="alignRight shortenTransform2"
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default TeacherViewAssessments;
