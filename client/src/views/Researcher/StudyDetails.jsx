import NavBar from '../../components/NavBar/NavBar';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudyDetails.less';
import { getStudy } from '../../Utils/requests';
import ClassroomList from './components/ClassroomList';
import StudentList from './components/StudentList';
import AddClassroom from './components/AddClassroom';
import AddStudent from './components/AddStudent';
import { addClassroomToStudy, addStudentToStudy } from '../../Utils/requests';


export default function StudyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [classroomList, setClassroomList] = useState();
  const [studentList, setStudentList] = useState();


  const updateClassroomList = (newClassroom) => {
    setClassroomList([...classroomList, newClassroom]);
    return [...classroomList, newClassroom];
  }

  const updateStudentList = (newStudent) => {
    setStudentList([...studentList, newStudent]);
    return [...studentList, newStudent];
  }

  const handleAddClassroom = async (studyId, newClassroomList) => {
    try {
      // Assuming you have an `addClassroom` function to add a new classroom
      const response = await addClassroomToStudy(studyId, newClassroomList);
  
      if (response.error) {
        console.error(response.error);
        // Handle error appropriately, show a message, etc.
      } else {
        // Update the classroom list with the new classroom
        console.log(response.data);
        
      }
    } catch (error) {
      console.error('Error adding classroom:', error);
      // Handle error appropriately, show a message, etc.
    }
  };
  

  const handleAddStudent = async (studyId, newStudentList) => {
    try {
      // Assuming you have an `addClassroom` function to add a new classroom
      const response = await addStudentToStudy(studyId, newStudentList);
  
      if (response.error) {
        console.error(response.error);
        // Handle error appropriately, show a message, etc.
      } else {
        // Update the classroom list with the new classroom
        console.log(response.data);
        
      }
    } catch (error) {
      console.error('Error adding student:', error);
      // Handle error appropriately, show a message, etc.
    }
  };
  

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
        <div className = "addClassroom">
          <AddClassroom
            studyId = {id}
            handleAddClassroom={handleAddClassroom}
            classroomList = {classroomList}
            updateClassroomList = {updateClassroomList}
          />
        </div>
        <div className = "classroomList">  
          <ClassroomList
            classroomList = {classroomList}
          />
        </div>
        <div className = "addStudent">
          <AddStudent
            studyId = {id}
            handleAddStudent={handleAddStudent}
            studentList = {studentList}
            updateStudentList = {updateStudentList}
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