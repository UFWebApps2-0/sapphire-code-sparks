import React from 'react';
import { Link } from 'react-router-dom';
import Placeholder from "../../assets/placeholder.jpg";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="text">
        <h1>Excepteur sint occaecat cupidatat</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt.</p>
        <Link to='/join'>Join Classroom</Link>
      </div>
      <div className="image">
        <img src={Placeholder} alt="Description" />
      </div>
    </section>
  );
};

export default HeroSection;