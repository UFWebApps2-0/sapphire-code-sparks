import React from 'react';
import { useParams } from 'react-router-dom';

const StudyDetails = () => {
  // Access the dynamic parameter from the URL
  const { id } = useParams();

  // Fetch the study details based on the id (you may want to use your API for this)
  // For now, just display the study id
  return (
    <div>
      <h2>Study Details</h2>
      <p>Study ID: {id}</p>
      {/* Add more details based on your study data */}
    </div>
  );
};

export default StudyDetails;
