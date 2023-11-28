import NavBar from '../../components/NavBar/NavBar';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupReport.less';
import AddStudy from './components/AddStudy';
import StudyList from './components/StudyList';


export default function GroupReport(props) {
  const navigate = useNavigate();
  const [studyList, setStudyList] = useState([]);
  
  // State to hold the current study
  const [study, setStudy] = useState({
    id: '',
    name: '',
    description: '',
  });

  const updateStudyList = (newStudyList) => {
    setStudyList(newStudyList);
  }

  const box={
    width: '150px',
    height: '70px',
    backgroundColor: 'white',
    padding: '10px',
    border: '2px solid black',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.377',
    borderRadius: '4px',
    marginTop: '20px',
    marginRight: '200px'
   
}

  return (
    <div className='container nav-padding'>
      <NavBar />
      {/* <h1>Group Report</h1> */}
        <div id='daily-report-header'>Studies</div>
        {/* Button to add a study */}
        <div className = "addStudyButton">
          <Popup trigger=
                {<button style={box}> Click to add study </button>} 
                modal nested>
                {
                    close => (
                        <div className='model'>
                            <AddStudy 
                              newList = {studyList}
                              setNewList = {setStudyList}
                              updateStudyList = {updateStudyList}
                            />
                            <div>
                                <button onClick=
                                    {() => close()}>
                                        Close
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
        <div className = "studyList">  
          <StudyList
            studyList = {studyList}
            updateStudyList = {updateStudyList}
          />
        </div>
      <div className='dashboard-button'>
        {/* Do we need a menu button to go back to report landing page?*/}
        <button
          id={'group-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate('/report')}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
