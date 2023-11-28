import React from 'react';
import FeatureProject from './FeatureProject';
import Placeholder from "../../assets/placeholder.jpg";


const Gallery = () => {
  return (
    <section className="gallery">
      <h2>Featured Projects</h2>
      <div className='grid'>
        <FeatureProject source={Placeholder}/>
        <FeatureProject source={Placeholder}/>
        <FeatureProject source={Placeholder}/>
      </div>
    </section>
  );
};

export default Gallery;