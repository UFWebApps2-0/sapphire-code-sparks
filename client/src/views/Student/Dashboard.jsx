import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getStudentClassroom } from '../../Utils/requests';
import './Student.less';

export default function Dashboard(){
    const [learningStandard, setLessonModule] = useState({});
    const navigate = useNavigate();

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
    return(
        <div className='container nav-padding'>
            <NavBar />
            <div id='activity-container'>
                <div id='header'>
                    <div>Dashboard</div>
                </div>
                <div id="containerDashboard">
                    <div className="dashboard-box">
                        Project 1       
                    </div>
                    <div className="dashboard-box">
                        Project 2
                    </div>
                    <div className="dashboard-box">
                        Project 3
                    </div>
                </div>
            </div>
        </div>
        );
}