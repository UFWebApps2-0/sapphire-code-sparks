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
      //this button is made to shift between names, and also change colors based on styles in the associated .less file
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
      //In terms of front end, CSS transition is used to give slight delay when closing each dropdown item tab. This is all done via the .desc class in the .less file
      
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