import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './StudyList.less';

function StudyList({ studyList, updateStudyList }) {
  function DropDownButton({ onClick }) {
    return (
      <button onClick={onClick} className="dropdown-button">
        ^
      </button>
    );
  }

  function DropDownStudies({ study }) {
    const [open, setOpen] = useState(false);

    const handleDropDownClick = () => {
      setOpen(!open);
    };

    return (
      <div className='dropdown-item'>
        
        <DropDownButton onClick={handleDropDownClick} />
        <div className="study-info">
          <p>Study Name: {study.name}</p>
        </div>

        <CSSTransition
          in={open}
          timeout={300}
          classNames='dropdown-content'
          unmountOnExit
        >
          <div className='dropdown-content'>
            <p>Description: {study.description}</p>
          </div>
        </CSSTransition>
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
