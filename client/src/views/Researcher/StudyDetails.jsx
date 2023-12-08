import NavBar from '../../components/NavBar/NavBar';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudyDetails.less';
import { getStudy } from '../../Utils/requests';
import ClassroomList from './components/ClassroomList';
import StudentList from './components/StudentList';


export default function StudyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [classroomList, setClassroomList] = useState();
  const [studentList, setStudentList] = useState();

  const updateClassroomList = (newClassroomList) => {
    setClassroomList(newClassroomList);
  }

  const updateStudentList = (newStudentList) => {
    setStudentList(newStudentList);
  }

  useEffect(() => {
    const fetchStudyDetails = async () => {
      try {
        const response = await getStudy(id);
        setStudy(response.data);
        setClassroomList(response.data.classrooms);
        setStudentList(response.data.students);
      } catch (error) {
        console.error('Error fetching study details:', error);
      }
    };

    fetchStudyDetails();
  }, [id]);

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container nav-padding'>
      <NavBar />
      {/* <h1>Group Report</h1> */}
        <div id='daily-report-header'>{study.name}</div>
        {/* Button to add a study */}
        <div className = "classroomList">  
          <ClassroomList
            classroomList = {classroomList}
            updateClassroomList = {updateClassroomList}
          />
        </div>
        <div className = "studentList">  
          <StudentList
            studentList = {studentList}
            updateStudentList = {updateStudentList}
          />
        </div>
      <div className='dashboard-button'>
        {/* Do we need a menu button to go back to report landing page?*/}
        <button
          id={'group-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate('/group-report')}
        >
          Return to Studies
        </button>
      </div>
    </div>
  );
}