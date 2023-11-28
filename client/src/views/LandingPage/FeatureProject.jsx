import React from 'react';

const FeatureProject = ({source}) => {
    return (
      <div className="flex-column">
        <div className='flex-row space-between'>
            <img src={source} alt="Project" />
        </div>
        <h2>Project Title</h2>
      </div>
    );
  };
  
  export default FeatureProject;