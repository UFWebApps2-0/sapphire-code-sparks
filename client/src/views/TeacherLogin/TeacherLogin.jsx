import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import { googleUserGetProfile, googleUserSetSession } from '../../Utils/GoogleAuthRequests';
import './TeacherLogin.less';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default function TeacherLogin() {
  const email = useFormInput('');
  const password = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    let body = { identifier: email.value, password: password.value };

    postUser(body)
      .then((response) => {
        setUserSession(response.data.jwt, JSON.stringify(response.data.user));
        setLoading(false);
        if (response.data.user.role.name === 'Content Creator') {
          navigate('/ccdashboard');
        } else if (response.data.user.role.name === 'Researcher') {
          navigate('/report');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error('Login failed. Please input a valid email and password.');
      });
  };

  const handleCredential = async (res) => {
    const dataRes = await googleUserGetProfile(res);
    googleUserSetSession(dataRes.data.token, dataRes.data.gapi_token, JSON.stringify(dataRes.data.user));
    navigate('/dashboard');
  }

  const scopes ='https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly';

  const googleLogin = useGoogleLogin({
    onSuccess: codeResponse => handleCredential(codeResponse.code),
    flow: 'auth-code',
    redirect_uri: 'postmessage',
    scope: scopes
  });

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    googleLogin();
  }
  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <div id='box-title'>User Login</div>
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

          <p id='forgot-password' onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </p>

          <button onClick={(e) => handleGoogleLogin(e)}>Sign in with Google</button>

          <input
            type='button'
            value={loading ? 'Loading...' : 'Login'}
            onClick={handleLogin}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
