import { Form, Input, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import { getStudentClassroom } from '../../../Utils/requests';
import '../Student.less';

export default function SignUp()
{
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);


    const handleSubmit=async(e)=>{
        e.preventDefault();
    if (email !== confirmEmail) {
        message.error('Email do not match! Please try again.');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
      } 
      else if(password === ''){
        message.error('Must enter a password');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
      }
      else if(!hasSpecialCharacter || !hasNumber || !hasUppercase){
        message.error('Password must contain at lease one special character, uppercase letter, and number');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
      }
      else{
        message.success('Signup Successful!');
        navigate('/studentParental');
      }
    }
    
    return(
        <div className='container nav-padding'>

            <NavBar />
            <div id='activity-container'>

                <div id='header'>
                    <div>Sign Up</div>
                </div>
                    <form id='parentalForm' className='forgetPsw'>
                    <div className='form-group'>
                        <label id='parentalLoginFont' htmlFor='email'>Email</label>
                        <br/>
                        <input onChange={(e) => setEmail(e.target.value)}
                         value={email} type='email' id='inputBox' name='email' placeholder='Enter your email' />
                    </div>

                    <div className='form-group'>
                        <label id='parentalLoginFont' htmlFor='confirmEmail'>Confirm Email</label>
                        <br/>
                        <input onChange={(e) => setConfirmEmail(e.target.value)}
                    value={confirmEmail} type='email' id='inputBox' name='confirmEmail' placeholder='Confirm your email' />
                    </div>

                    <div className='form-group'>
                        <label id='parentalLoginFont' htmlFor='password'>Password</label>
                        <br/>
                        <input onChange={(e) => setPassword(e.target.value)}
                         value={password}type='password' id='inputBox' name='password' placeholder='Enter your password' />
                    </div>
                    <br/>
                    <button type='submit' id='button' onClick={handleSubmit}> Sign Up</button>   
                </form>
                </div>
        </div>
        
    );
}