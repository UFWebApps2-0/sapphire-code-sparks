import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import { getStudentClassroom } from '../../../Utils/requests';
import '../Student.less';
export default function Parental(){
    const [learningStandard, setLessonModule] = useState({});
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");

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

                {/* Login page */}
                {action === "Login"? <div className="LoginPage">
                <div>
                <form>
                    <div>
                        <label id='parentalLoginFont' htmlFor='email'>Email</label>
                        <br/>
                        <input type='email' id='inputBox' name='email' placeholder='Enter your email' />
                        </div>

                        <div>
                        <label id='parentalLoginFont' htmlFor='password'>Password</label>
                        <br/>
                        <input type='password' id='inputBox' name='password' placeholder='Enter your password' />
                        </div>
                    </form>
                    <br/>
                    <button type='submit' id='button'>Login</button>   
                    <br/>  

                  {/*Change the useState and direct to the targeted form*/}
                    <span id='signup'><p onClick={() => navigate('/sign-up')}>New? Sign Up Now</p></span>
                    <span id='forgetPsw'><p onClick={() => navigate('/forget-psw')}>Forget Password?</p></span>
                </div>
                </div>:
                <div></div>
                }

                </div>
        </div>
    );
}