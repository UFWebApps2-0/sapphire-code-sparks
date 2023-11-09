import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { registerUser, setUserSession } from '../../Utils/AuthRequests'; 
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
  const confirmPassword = useFormInput('');
  const [accountType, setAccountType] = useState(''); // Added state for account type
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    if(password.value !== confirmPassword.value) {
      message.error('Passwords do not match.');
      return;
    }
    if(!usernameRegex.test(username.value)) {
      message.error('Username must only contain letters, numbers, and underscores.');
      return;
    }
    if(!emailRegex.test(email.value)) {
      message.error('Invalid email.');
      return;
    }
    // if(!passwordRegex.test(password.value)) {
    //   message.error('Password must be at least 4 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.');
    //   return;
    // }


    setLoading(true);
    let body = { 
      username: username.value, 
      email: email.value, 
      password: password.value,
      role: accountType 
    };

    registerUser(body)
      .then((response) => {
        setUserSession(response.data.jwt, JSON.stringify(response.data.user));
        setLoading(false);
        navigate('/teacherlogin');
      })
      .catch(error => {
        setLoading(false);
        message.error(error.response?.data?.message[0]?.messages[0]?.message || 'Signup failed.');
      });
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onSubmit={handleSignup} // Form submission is now handled by the handleSignup function
        >
          <div id='box-title'>User Signup</div>
          <input type='text' {...username} placeholder='Username' autoComplete='username' />
          <input type='email' {...email} placeholder='Email' autoComplete='email' />
          <input type='password' {...password} placeholder='Password' autoComplete='new-password' />
          <input type='password' {...confirmPassword} placeholder='Confirm Password' autoComplete='new-password' />
          <select name="accountType" id="accountType" onChange={(e) => setAccountType(e.target.value)}>
            <option value="" disabled hidden>Account Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="administrator">Administrator</option>
          </select>
          <input type='button' value={loading ? 'Loading...' : 'Signup'} disabled={loading} onClick={handleSignup}/>
        </form>
      </div>
    </div>
  );
}
