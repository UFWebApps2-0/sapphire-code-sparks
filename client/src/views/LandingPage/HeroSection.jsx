import React from 'react';
import { Link } from 'react-router-dom';
import Placeholder from "../../assets/hero-graphic.png";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="text">
        <h1>Begin your Personalized Learning Journey</h1>
        <p>Code-sparks is built to make teaching and learning easier for everyone.
          Join a classroom now to get started.
        </p>
        <Link to='/join'>Join Classroom</Link>
      </div>
      
        <img src={Placeholder} alt="Description" />
      
    </section>
  );
};

export default HeroSection;