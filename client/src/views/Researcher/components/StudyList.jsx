import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import './StudyList.less';

function StudyList({ studyList}) {
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

  function DropDownStudies({ study }) {
    const [open, setOpen] = useState(false);

    const handleDropDownClick = () => {
      setOpen(!open);
    };

    return (
      <div>
        
      <div className='dropdown-item'>
        
        <div className="study-info">
          <p style={{color: 'white'}}>Study Name: {study.name}</p>
        </div>
        <CSSTransition
          in={open}
          timeout={150}
          classNames='desc'
          unmountOnExit
        >
          <div className='desc'>
            <p>Description: {study.description}</p>
            <Link to={`/study/${study.id}`} className="study-link">
              View Study Details
            </Link>
          </div>
        </CSSTransition>


        <DropDownButton 
          onClick={handleDropDownClick} 
          isOpen={open}
        />
      
        
      </div>
      </div>
    );
  }

  return (
    <div className='dropdown'>
      {studyList.map((study) => (
        <DropDownStudies key={study.id} study={study} />
      ))}
    </div>
  );
}

export default StudyList;