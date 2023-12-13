import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getStudentName, getStudentClassroom } from '../../Utils/requests';
import './Student.less';

export default function Dashboard(){
    const [learningStandard, setLessonModule] = useState({});
    const [currentStudent, setCurrentStudent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await getStudentName();
            if (res.data) {
            if (res.data.students) {
                console.log(res.data);
                setCurrentStudent(res.data.students[0].name);
            }
            } else {
            message.error(res.err);
            }
        } catch {}
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await getStudentClassroom();
            if (res.data) {
                console.log(JSON.stringify(res.data.lesson_module.name));
                if (res.data.lesson_module)
                {
                    setLessonModule(res.data.lesson_module);
                }
            } else {
            message.error(res.err);
            }
        } catch {}
        };
        fetchData();
    }, []);

    const handleLessonButton = () => {
        navigate('/studentLessons')
      };

    return(
        <div className='container nav-padding'>
            <NavBar />
            <div id='activity-container'>
                <div id='header'>
                    <div>Dashboard</div>
                </div>
                <h1 id="studentNameHeader">Welcome {typeof currentStudent === 'string' ? JSON.stringify(currentStudent).slice(1, -1) : ''} !</h1>
                <h2 id="lessonModuleHeader">Current Lesson Module</h2>
                <div id="containerDashboard">
                    <div className="dashboard-box" onClick={handleLessonButton}>
                        <div id="lessonName">
                        {typeof learningStandard.name === 'string' ? JSON.stringify(learningStandard.name).slice(1, -1) : ''}
                        </div>
                        <div>
                        {typeof learningStandard.expectations === 'string' ? JSON.stringify(learningStandard.expectations).slice(1, -1) : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}