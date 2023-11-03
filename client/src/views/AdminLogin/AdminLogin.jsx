import React from 'react';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {postUser, setUserSession} from '../../Utils/AuthRequests';
import NavBar from '../../components/NavBar/NavBar.jsx'
import '../TeacherLogin/TeacherLogin.less'

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

    const handleLogin = () => {
        setLoading(true);

        // Credentials used to log in and authenticate the user (https://docs.strapi.io/dev-docs/plugins/users-permissions)
        let body = {
            identifier: email.value,
            password: password.value
        }

        // Sends the body to the API route (/auth/local) for logging in
        postUser(body)
            .then((response) => {
                setUserSession(response.data.jwt, JSON.stringify(response.data.user));
                setLoading(false);
                
                // If the credentials correspond to an administrator, the user is teleported to the administrator's dashboard
                if (response.data.user.role.name === 'Administrator')
                    navigate('/adminDash');
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