import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getStudentClassroom } from '../../Utils/requests';
import './Student.less';

export default function Classroom(){
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
                    <div>Classroom</div>
                </div>
            </div>
        </div>
    );
}