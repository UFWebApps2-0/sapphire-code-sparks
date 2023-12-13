import { Form, Input, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import { forgetPassword } from '../../../Utils/requests';
import '../Student.less';

export default function ForgetPsw()
{
    const [email, setEmail] = useState('');
    const [timeout, setTimeout] = useState(0);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    setShowSuccessMsg(false);
    setLoading(true);
    const res = await forgetPassword(email);
    if (res.err) {
      message.error(res.err);
    } else {
      message.success('Successfully send email');
      setTimeout(120);
      setShowSuccessMsg(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (timeout > 0) {
        setTimeout(timeout - 1);
      }
    }, 1000);
    return () => clearInterval(myInterval);
  });
  
    return(
        <div className='container nav-padding'>

            <NavBar />
            <div id='activity-container'>

                <div id='header'>
                    <div>Forget Password</div>
                </div>
                <form>
                        <div id='paretnalForm'>
                        <label id='parentalLoginFont' htmlFor='email'>Email</label>
                        <br/>
                        <Form.Item id='form-label'>
                            <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type='email'
                            placeholder='Enter your email'
                            required
                            autoComplete='email'
                            id='inputBox'
                            />
                        </Form.Item>
                        {showSuccessMsg && (
                            <Alert
                            type='success'
                            message='You will receive a link with a one-time token to reset your password. Please check your email as well as the spam folder. '
                            ></Alert>
                            
                        )}
                        <Form.Item>
                        <Button
                        onClick={handleSubmit}
                        id='button'
                        type='primary'
                        htmlType='submit'
                        size='large'
                        disabled={timeout > 0 || loading}
                        >
                        {timeout <= 0 ? 'Submit' : '(' + timeout + ')'}
                        </Button>
                    </Form.Item>
                        </div>
                    </form>
                    <br/>
                    {/* <button type='submit' id='button'>Send Email</button>    */}
                    
                </div>
        </div>
        
    );
}