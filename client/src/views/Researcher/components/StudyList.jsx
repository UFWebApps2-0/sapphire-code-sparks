import React, {useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import './StudyList.less';
import { ReactComponent as arrow_icon} from 'react';
 

function StudyList({studyList, updateStudyList}) {
    const [open, setOpen] = useState(true);

    function DropDownButton(props){
        
    }

    function DropDownMenu(){
        function DropDownStudies(props){
            return(
                <a href = "#" className='dropdown-item'>
                    <span className='icon-button'>{props.leftIcon}</span>
                    {props.children}
                    <span className = "icon-right">{props.rightIcon}</span>
                </a>
            )
        }
        return (
            <div className='dropdown'>
            <ul>
          {studyList.map(study => (
            <li key={study.id}>{study.name}</li>
          ))}
        </ul>
          </div>
        )
    }

    return (
        <DropDownMenu/>
        
    );
    
  }
  
  export default StudyList;