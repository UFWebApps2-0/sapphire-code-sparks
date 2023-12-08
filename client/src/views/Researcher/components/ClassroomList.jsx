import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import './ClassroomList.less'; // Make sure to create this .less file

function ClassroomList({ classroomList }) {
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

  function DropDownClassrooms({ classroom }) {
    const [open, setOpen] = useState(false);

    const handleDropDownClick = () => {
      setOpen(!open);
    };

    return (
      <div className='dropdown-item'>
        <DropDownButton onClick={handleDropDownClick} />
        <div className="classroom-info">
          <p>Classroom Name: {classroom.name}</p>
        </div>

        <CSSTransition
          in={open}
          timeout={300}
          classNames='dropdown-content'
          unmountOnExit
        >
          <div className='dropdown-content'>
            <p>Description: {classroom.description}</p>
            <Link to={`/classroom/${classroom.id}`} className="classroom-link">
              View Classroom Details
            </Link>
          </div>
        </CSSTransition>
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
