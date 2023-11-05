import React, { useState } from 'react';
import GradeSearch from './4b/Search';
import ToGradeView from './4b/ToGradeView';
import GradeList from './4b/GradeList';

function GradePreview({assessmentID, gradeData}) {
  // TODO: Update the following two variables to use the useState() hook
  const [filterText, setFilterText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(0);

  function filterUpdate(value) {
    //Set the state of the filter text to the value being passed in
    setFilterText(value);
  }
  
  // IDK if student data will have id #s or if this should be their name
  function selectedUpdate(id) {
    //Set the state of the selected building to the id being passed in
    setSelectedStudent(id);
  }

  return (
    <div className="bg">
      <div className="row">
        <h1>Assessment Grades: {assessmentID}</h1>
      </div>
      <GradeSearch filterUpdate={filterUpdate}/>
      <main>
        <div className="row">
          <div className="column1">
            <div className="tableWrapper">
              <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: Edit GradeList component to match neccessary grade.json formatting */}
                <GradeList data={gradeData} selectedUpdate={selectedUpdate} filterText={filterText} />
              </tbody>
              </table>
            </div>
          </div> 
        </div>
      </main>
      {/* IDK where to put this but it should (TODO) redirect to the students assessment page when student on list is selected*/}
      {/*<ToGradeView data={gradeData} selectedStudent={selectedStudent}/>*/}
    </div>
  );
}

export default GradePreview;
