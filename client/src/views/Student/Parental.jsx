import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getStudentClassroom } from '../../Utils/requests';
import './Student.less';

export default function Parental(){
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
                    <div>Parental</div>
                </div>

                <form>
                    <div className='form-group'>
                        <label htmlFor='email'>Email:</label>
                        <input type='email' id='email' name='email' placeholder='Enter your email' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='confirmEmail'>Confirm Email:</label>
                        <input type='email' id='confirmEmail' name='confirmEmail' placeholder='Confirm your email' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' name='password' placeholder='Enter your password' />
                    </div>

                    <button type='submit'>Submit</button>
                </form>
                
            </div>
        </div>
    );
}