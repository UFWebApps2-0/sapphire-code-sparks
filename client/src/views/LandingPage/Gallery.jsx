import React from 'react';
import FeatureProject from './FeatureProject';
import Placeholder from "../../assets/placeholder.jpg";


const Gallery = () => {
  return (
    <section className="gallery">
      <h2 style={{alignText: 'left'}} >Coming Soon - Featured Projects</h2>
      <div className='grid'>
        {/* <h1>Coming Soon...</h1> */}
        <FeatureProject source={Placeholder}/>
        <FeatureProject source={Placeholder}/>
        <FeatureProject source={Placeholder}/>
      </div>
    </section>
  );
};

export default Gallery;