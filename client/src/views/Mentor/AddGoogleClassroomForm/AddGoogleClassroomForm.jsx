import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { message } from 'antd';
import './AddGoogleClassroomForm.less';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate, useLocation } from 'react-router-dom';

// Google Api Imports
import { googleAddClassroom, googleGetClassroom, googleGetClassrooms } from '../../../Utils/googleRequests';
import { googleGetGapiToken } from '../../../Utils/GoogleAuthRequests';

export default function AddGoogleClassroomForm() {
  const [value] = useGlobalState('currUser');
  const location = useLocation();
  const { id, name, enrollmentCode } = location.state;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grade: '',
    school: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Fetch current user data from Strapi and store it in sessionStorage
    getCurrentUser().then(user => {
      sessionStorage.setItem('currUser', JSON.stringify(user));
      // Update form data with user info
      setFormData({ ...formData, firstName: user.firstName, lastName: user.lastName });
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleAddClassroom = () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currUser'));
    const classroomObj = {
      name,
      school: formData.school,
      grade: formData.grade,
      enrollmentCode,
      mentorObj: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        school: formData.school,
        user: currentUser.id // Assuming 'id' is the user identifier
      }
    }

    googleAddClassroom(id, classroomObj).then(res => {
      console.log(res);
      navigate('/dashboard');
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome {value.name}</div>
      <MentorSubHeader title={'Add Google Classroom'}></MentorSubHeader>
      <div id='classrooms-container'>
        <button onClick={() => handleAddClassroom()}>Add Classroom</button>
      </div>
    </div>
  )

}

