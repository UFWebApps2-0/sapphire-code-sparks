import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Gallery from './Gallery';
import './LandingPage.less';

export default function LandingPage(){
    const navigate = useNavigate();
    return(
        <div className='container'>
            <Navbar />
            <HeroSection />
            <Gallery />
        </div>
    )
}