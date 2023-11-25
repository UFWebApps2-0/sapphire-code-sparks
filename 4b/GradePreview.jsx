import React, { useState } from 'react';
import GradeSearch from "../4b/GradeSearch";
import GradeList from "../4b/GradeList";
//import getGrades from "../client/src/util/request.js"
import './TeacherViewAssessments.css';
import NavBar from "../client/src/components/NavBar/NavBar";
import {useParams} from "react-router-dom"

// TODO get grade data from datebase
// Assessment identifier should be passed in from previous page
function GradePreview() {
  //const loc = useLocation(); // used for passing params through navagation
  const [filterText, setFilterText] = useState('');

  function filterUpdate(value) {
    //Set the state of the filter text to the value being passed in
    setFilterText(value);
  }
  const {assessID} = useParams(); // can pass assessment id, name, class id, etc
  const gradeData = [{
        name:"Red and Blue", 
        student: "Jim",
        score:99,
        grade: 99
    },
    {
        name:"Red and Blue",
        student: "Jam",
        score:98,
        grade: 98
    },
    {
        name:"Red and Blue",
        student: "Joe",
        score:100,
        grade: 100
    },
    {
      name:":name",
      student: "Not Joe",
      score:100,
      grade: 100
    },
  ]; // delete this and use server call above
    console.log(gradeData)
  return (
    <main className="background">
      {/*add yellow back arrow*/}
      <div id="main-header">
        <br></br>{assessID}: Grades
      </div>
      <NavBar isMentor={true}/>
      
      <div className="projectText">
        <p>Put Assessment Graph Here</p> {/*Put Assessment Graph here */}
      </div>
      <div>
        <GradeSearch filterUpdate={filterUpdate}/>
        {/* TODO: Edit GradeList component to match neccessary grade.json formatting */}
        <GradeList data={gradeData} filterText={filterText} assessID={assessID}/>
      </div>
    </main>
  );
}

export default GradePreview;
