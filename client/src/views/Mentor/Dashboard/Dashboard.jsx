import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms, getAllClassrooms } from '../../../Utils/requests';
import { message } from 'antd';
import './Dashboard.less';
import DashboardDisplayCodeModal from './DashboardDisplayCodeModal';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [mentorClassrooms, setMentorClassrooms] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();

  //TODO
  // If a classroom's id matches with one of the mentor IDs, don't display the name
  // Otherwise, for each thing, get all the mentors assoicated with that classroom and show their names

  // Separate thing for whether we display the copy button - same condition

  useEffect(() => {
    let classroomIds = [];
    let classroomsTest = [];
    getAllClassrooms().then((res) => { // getMentor
      if (res.data) {
        res.data.forEach((classroom) => {
          classroomsTest.push(classroom);
          //classroomIds.push(classroom.id);
        });
        setClassrooms(classroomsTest);
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });

    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        setMentorClassrooms(classroomIds);
        // getClassrooms(classroomIds).then((classrooms) => {
        //   setClassrooms(classrooms);
        // });
      }
    });
  }, []);

  // res.data.classrooms.forEach((classroom) => {
  //   classroomIds.push(classroom.id);
  // });

  function checkForOwnership(classroom){
      // For each of the mentor's classrooms
      for (let i = 0; i < mentorClassrooms.length; i++) {
        if(mentorClassrooms.at(i) == classroom.id){
          return true;
        }
      }
      return false;
  }

  function displayMentorName(classroom){
    if(!checkForOwnership(classroom)){
      return (
        <h2>{classroom.mentors[1].first_name + ' ' + classroom.mentors[1].last_name}</h2>
      );
    }
    return '';
  }

  function displayCopyClassroomButton(classroom){
    if(!checkForOwnership(classroom)){
      return (
        <button onClick={() => handleCopyClassroom(classroom.id)}>
                    Copy
        </button>
      );
    }
    return '';
  }

  const handleViewClassroom = (classroomId) => {
    
    navigate(`/classroom/${classroomId}`);
  };

  const handleCopyClassroom = (classroomId) => {
    
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome {value.name}</div>
      <MentorSubHeader title={'Your Classrooms'}></MentorSubHeader>
      <div id='classrooms-container'>
        <div id='dashboard-card-container'>
          {classrooms.map((classroom) => (
            <div key={classroom.id} id='dashboard-class-card'>
              <div id='card-left-content-container'>
                <h1 id='card-title'>{classroom.name}</h1>
                {displayMentorName(classroom)}
                <div id='card-button-container' className='flex flex-column'>
                  <button onClick={() => handleViewClassroom(classroom.id)}>
                    View
                  </button>
                  {displayCopyClassroomButton(classroom)}
                </div>
              </div>
              <div id='card-right-content-container'>
                <DashboardDisplayCodeModal code={classroom.code} />
                <div id='divider' />
                <div id='student-number-container'>
                  <h1 id='number'>{classroom.students.length}</h1>
                  <p id='label'>Students</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
