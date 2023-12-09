import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import './ClassroomList.less'; 

function ClassroomList({ classroomList }) {
  function DropDownButton({ onClick, isOpen }) {
    const handleClick = (e) => {
      e.stopPropagation();
      onClick();
    };

    return (
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
