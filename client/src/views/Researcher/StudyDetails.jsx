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

  //Updating functions for both classroom and student lists
  const updateClassroomList = (newClassroom) => {
    setClassroomList([...classroomList, newClassroom]);
    return [...classroomList, newClassroom];
  }

  const updateStudentList = (newStudent) => {
    setStudentList([...studentList, newStudent]);
    return [...studentList, newStudent];
  }
  //Handles add classroom similar to add student
  const handleAddClassroom = async (studyId, newClassroomList) => {
    try {
      const response = await addClassroomToStudy(studyId, newClassroomList);
      if (response.error) {
        console.error(response.error);
      } else {
        console.log(response.data);
        
      }
    } catch (error) {
      console.error('Error adding classroom:', error);
    }
  };
  //Handles add student so it can be called in other components
  const handleAddStudent = async (studyId, newStudentList) => {
    try {
      const response = await addStudentToStudy(studyId, newStudentList);
      if (response.error) {
        console.error(response.error);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };
  //Fetches the details of a study including the classroom list and student list
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

  //very similar page to studies.jsx but has all these extra components
  return (
    <div className='container nav-padding'>
      <NavBar />
        <div style={{color: 'white', fontSize: '3em'}}>{study.name}</div>
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
        <button
          id={'group-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate('/studies')}
        >
          Return to Studies
        </button>
      </div>
    </div>
  );
}