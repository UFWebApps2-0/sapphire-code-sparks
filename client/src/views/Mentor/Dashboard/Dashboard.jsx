import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { message } from 'antd';
import './Dashboard.less';
import DashboardDisplayCodeModal from './DashboardDisplayCodeModal';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';

// Google Api Imports
import { googleGetClassroom, googleGetClassrooms } from '../../../Utils/googleRequests';
import { googleGetGapiToken } from '../../../Utils/GoogleAuthRequests';

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [googleClassrooms, setGoogleClassrooms] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();

  useEffect(() => {

    let classroomIds = [];
    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        getClassrooms(classroomIds).then((classrooms) => {
          setClassrooms(classrooms);
        });
      }
      // Case where use is a google authenticated user
      else if (googleGetGapiToken() != null) {
        googleGetClassrooms().then(res => {
          const googleClassrooms = []
          res.data.courses.forEach(course => {
            googleClassrooms.push(course);
          });
          setGoogleClassrooms(googleClassrooms);
        })

      }
      else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });


  }, []);

  const handleViewClassroom = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  const handleGoogleAddClassroom = (classroomId) => {
    console.log(classroomId)
    googleGetClassroom(classroomId).then(res => {
      if(res.data) {
        // navigate to add class room form
      
        navigate('/add-google-classroom-form', { state: res.data.course });
      }
      else {
        message.error(res.err);
        navigate('/teacherlogin');
      }

    }).catch(err => {
      console.log(err);
    })
  }

  // If Google authenticated user
  if (classrooms.length == 0 && googleGetGapiToken() != null) {
    return (
      <div className='container nav-padding'>
        <NavBar />
        <div id='main-header'>Welcome {value.name}</div>
        <MentorSubHeader title={'Your Classrooms'}></MentorSubHeader>
        <div id='classrooms-container'>
          <div id='dashboard-card-container'>
            {googleClassrooms.map(classroom => (
              <div key={classroom.id} id='dashboard-class-card'>
                <div id='card-left-content-container'>
                  <h1 id='card-title'>{classroom.name}</h1>
                  <div id='card-button-container' className='flex flex-row'>
                    <button onClick={() => handleGoogleAddClassroom(classroom.id)}>
                      Add Class
                    </button>
                  </div>
                </div>
                <div id='card-right-content-container'>
                  <DashboardDisplayCodeModal code={classroom.enrollmentCode} />
                  <div id='divider' />
                  <div id='student-number-container'>
                    <p id='label'></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  else {
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
                  <div id='card-button-container' className='flex flex-row'>
                    <button onClick={() => handleViewClassroom(classroom.id)}>
                      View Classroom
                    </button>
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

}

