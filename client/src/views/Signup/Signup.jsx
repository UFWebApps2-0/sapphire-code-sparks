import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import './Signup.less';

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

export default function Signup() {
  const username = useFormInput('');
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
          <div id='box-title'>User Signup</div>
          <input
            type='text'
            {...username}
            placeholder='Username'
            autoComplete='username'
            class='username-input'
          />
          <input
            type='email'
            {...email}
            placeholder='Email'
            autoComplete='email'
          />
          <input
            type='password'
            {...password}
            placeholder='Password'
            autoComplete='new-password'
          />
          <input
            type='password'
            {...password}
            placeholder='Confirm Password'
            autoComplete='new-password'
          />
          <select name="accountType" id="accountType">
            <option value="placeholder" selected disabled hidden>Account Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="administrator">Administrator</option>
          </select>
          <input
            type='button'
            value={loading ? 'Loading...' : 'Signup'}
            onClick={handleLogin}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
