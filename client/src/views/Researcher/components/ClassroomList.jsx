import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import './ClassroomList.less'; 

//this code file is formatted very similar to study list in terms of front end styling
function ClassroomList({ classroomList }) {
  function DropDownButton({ onClick, isOpen }) {
    const handleClick = (e) => {
      e.stopPropagation();
      onClick();
    };

    return (
      //button toggles names and color based on click state, and references red-button class
      <button
        onClick={handleClick}
        className={`red-button ${isOpen ? 'red-button-open' : ''}`}
      >
        {isOpen ? 'Hide Description' : 'Show Description'}
      </button>
    );
  }

  function DropDownClassrooms({ classroom }) {
    const [open, setOpen] = useState(false);

    const handleDropDownClick = () => {
      setOpen(!open);
    };

    return (
      //divs are ordered in specific way to ensure that description comes out in center when opened, and button and names are on opposite sides
      <div className='dropdown-item'>
        <div className='dropdown-item'>
          <div className="classroom-info">
            <p>Classroom Name: {classroom.name}</p>
          </div>
          <CSSTransition
            in={open}
            timeout={150}
            classNames='desc'
            unmountOnExit
          >
            <div className='desc'>
              <p>Description: {classroom.description}</p>
              <Link to={`/classroom/${classroom.id}`} className="study-link">
                View Classroom Details
              </Link>
            </div>
          </CSSTransition>
          <DropDownButton isOpen={open} onClick={handleDropDownClick} />
        </div>
      </div>
    );
  }

  return (
    <div className='dropdown'>
      {classroomList.map((classroom) => (
        <DropDownClassrooms key={classroom.id} classroom={classroom} />
      ))}
    </div>
  );
}

export default ClassroomList;
