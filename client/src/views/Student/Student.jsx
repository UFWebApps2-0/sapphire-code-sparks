import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import StuNavBar from '../Student/stuNavBar'
import { getStudentClassroom } from '../../Utils/requests';
import './Student.less';
/*import {Dashboard} from '../Student/Dashboard'
import {Lessons} from '../Student/Lessons'
import {Classroom} from '../Student/Classroom'
import {Parental} from '../Student/Parental'*/


function Student() {
  const [learningStandard, setLessonModule] = useState({});
  const navigate = useNavigate();

  const [currPage, changeCurrPage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudentClassroom();
        if (res.data) {
          if (res.data.lesson_module) {
            setLessonModule(res.data.lesson_module);
          }
        } else {
          message.error(res.err);
        }
      } catch {}
    };
    fetchData();
  }, []);

  const handleSelection = (activity) => {
    activity.lesson_module_name = learningStandard.name;
    localStorage.setItem('my-activity', JSON.stringify(activity));

    navigate('/workspace');
  };

  return (
    <div className='student-view'>
      {/* <StuNavBar changeCurrPage={changeCurrPage}/> */}
      <div className='container nav-padding'>
          <NavBar />
      
          <div id='activity-container'>
              <div id='header'>
                  <div>Welcome!</div>
              </div>
          </div>
      </div>

      {/* {currPage === 0 ? <Dashboard /> : currPage === 1 ? <Lessons /> : currPage === 2 ? <Classroom /> : currPage === 3 ? <Parental /> : null} */}
      
    </div>
  );
}

export default Student;
