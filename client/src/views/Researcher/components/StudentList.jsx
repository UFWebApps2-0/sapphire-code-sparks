import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import './StudentList.less'; 

function StudentList({ studentList, updateStudentList }) {
  function DropDownButton({ onClick }) {
    const handleClick = (e) => {
      e.stopPropagation();
      onClick();
    };

    return (
      <button onClick={handleClick} className="dropdown-button">
        ^
      </button>
    );
  }

  function DropDownStudents({ student }) {
    const [open, setOpen] = useState(false);

    const handleDropDownClick = () => {
      setOpen(!open);
    };

    return (
      <div className='dropdown-item'>
         <div className="content">
          <p>Student Name: {student.name}</p>
        </div>

        
          <div className='content'>
            <p>Student ID: {student.id}</p>
            {/*<Link to={`/student/${student.id}`} className="student-link">
              View Student Details
            </Link>*/}
          </div>
        
       
      </div>
    );
  }

  return (
    <div className='dropdown'>
      {studentList.map((student) => (
        <DropDownStudents key={student.id} student={student} />
      ))}
    </div>
  );
}

export default StudentList;
