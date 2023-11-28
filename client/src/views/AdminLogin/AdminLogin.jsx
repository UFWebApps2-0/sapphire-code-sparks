import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import NavBar from '../../components/NavBar/NavBar.jsx';
import '../TeacherLogin/TeacherLogin.less';
import { message } from 'antd';


const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const handleChange = (e) => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    };
}


export default function AdminLogin() {
    const email = useFormInput('');
    const password = useFormInput('');

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    // Logs in Administrator
    const handleLogin = () => {
        setLoading(true);

        let body = {
            identifier: email.value,
            password: password.value
        }

        postUser(body)
            .then((response) => {
                setUserSession(response.data.jwt, JSON.stringify(response.data.user));
                setLoading(false);
                console.log(response.data); 
                if (response.data.user.role.name === 'Administrator')
                    
                    navigate('/admin-dashboard');
            })
            .catch((error) => {
                setLoading(false);
                message.error('Login failed. Please input a valid email and password.');
            })
    }


    return (
        <div className='container nav-padding'>
            <NavBar />
            <div id='content-wrapper'>
                <form
                    id='box'
                    onKeyPress={(e) => {if (e.key === 'Enter') handleLogin();}}
                >
                    <div id='box-title'>Admin Login</div>
                    <input
                        type='email'
                        {...email}
                        placeholder='Email'
                        autoComplete='username'
                    />
                    <input
                        type='password'
                        {...password}
                        placeholder='Password'
                        autoComplete='current-password'
                    />
                    <input
                        type='button' 
                        onClick={handleLogin} 
                        value={loading ? 'Loading...' : 'Login'} 
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    )
}