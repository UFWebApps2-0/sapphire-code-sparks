import NavBar from '../../components/NavBar/NavBar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studies.less';
import AddStudy from './components/AddStudy';
import StudyList from './components/StudyList';
import Popup from 'reactjs-popup';
import {
  getAllStudies,
  addStudy,
} from '../../Utils/requests';

export default function Studies(props) {
  const navigate = useNavigate();
  const [studyList, setStudyList] = useState([]);
  
  useEffect(() => {
    const fetchStudies = async () => {
      const studies = await getAllStudies();
      setStudyList(studies.data);
    };

    fetchStudies();
  }, []);

  const handleAddStudy = async (newStudy) => {
    const response = await addStudy(newStudy);

    if (response.error) {
      console.error(response.error);
    } else {
      console.log(response.data);
      setStudyList((prevList) => [...prevList, response.data]);
    }
  };

  const updateStudyList = (newStudyList) => {
    setStudyList(newStudyList);
  }

  const box={
    width: '1000px',
    height: '70px',
    backgroundColor: 'white',
    padding: '10px',
    border: '2px solid black',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.377',
    borderRadius: '4px',
    marginTop: '20px'
}

  return (
    <div className='container nav-padding'>
      <NavBar />
      {/*ensures correct formatting for everything in the botton list*/}
      <div className='daily-report-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>List of Studies</div>
        <button
        id={'group-level-return'}
        type='button'
        onClick={() => navigate('/report')}
        >
        Return to Dashboard
        </button>
      </div>
        {/*Creates and adds a new study for the researcher to manage*/}
        <div>
          <Popup trigger=
                {<button className='addStudyButton'>Click to add study</button>} 
                modal nested>
                {
                    close => (
                        <div className='model'>
                            <AddStudy 
                              handleAddStudy = {handleAddStudy}
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
          {/*Uses StudyList tag to display current list of studies*/}
          <StudyList
            studyList = {studyList}
            updateStudyList = {updateStudyList}
          />
        </div>
    </div>
  );
}