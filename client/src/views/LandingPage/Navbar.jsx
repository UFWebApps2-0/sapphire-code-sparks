import React from 'react';
import { Link } from 'react-router-dom'
import Logo from "../../assets/Code-Sparks-logos_white.png";

const Navbar = () => {
  return (
    <nav>
        <div className='flex flex-row justify-center align-center'>
            <div className="logo">
                <img src={Logo} className='logo' alt='logo'/>
            </div>
            <div className='links'>
                <Link to="/about">About</Link>
                <Link to="/about">Help</Link>
                <Link to="/about">FAQs</Link>
            </div>
        </div>
        <div className="links">
            <div className="dropdown">
                <button className="dropbtn">Login</button>
                <div className="dropdown-content">
                    <Link to="/login">Student Login</Link>
                    <Link to="/teacherlogin">Teacher Login</Link>
                </div>
            </div>
            <Link className='navbtn' to="/join">Join</Link>
        </div>
    </nav>
  );
};

export default Navbar;