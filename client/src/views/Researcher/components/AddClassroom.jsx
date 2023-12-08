import React, { useState, useEffect } from 'react';
import { getAllClassrooms, getClassroom } from '../../../Utils/requests'; // Adjust the path accordingly
import './AddClassroom.less'; // Adjust the style file import

function AddClassroom({studyId, handleAddClassroom, updateClassroomList}) {
  const [classroomId, setClassroomId] = useState('');
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    // Fetch the list of classrooms when the component mounts
    async function fetchClassrooms() {
      try {
        const response = await getAllClassrooms();
        const classroomsData = response.data; // Access the 'data' property
        setClassrooms(classroomsData);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        // Handle error as needed
      }
    }
  
    fetchClassrooms();
  }, []);
  

  async function handleSelectClassroom(id) {
  try {
    const response = await getClassroom(id);
    addClassroomFunc(updateClassroomList(response.data));
  } catch (error) {
    console.error('Error fetching classroom details:', error);
    // Handle error as needed
  }
}


  function addClassroomFunc(newCLList) {
    // Check if a classroom is selected before adding
    if (newCLList) {
      handleAddClassroom(studyId, newCLList);
      
      // Reset the state after adding
      setClassroomId('');
    } else {
      // Handle the case where no classroom is selected
      console.error('Please select a classroom.');
    }
  }


  return (
    <div className='box'>
      <h2>Add a Classroom</h2>
      <div>
        <label style={{ padding: '10px' }}>Click to add a classroom:</label>
        <select
  value={classroomId}
  onChange={(e) => {
    setClassroomId(e.target.value);
    handleSelectClassroom(e.target.value);
  }}
>
  <option value="" disabled>
    -- Select Classroom --
  </option>
  {classrooms.map((classroom) => (
      <option key={classroom.id} value={classroom.id}>
        {classroom.name}
      </option>
    ))}
</select>

      </div>
    
    </div>
  );
}

export default AddClassroom;
