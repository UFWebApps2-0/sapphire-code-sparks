import React, { useState, useEffect } from 'react';
import { getAllClassrooms, getClassroom } from '../../../Utils/requests'; 
import './AddClassroom.less'; 

function AddClassroom({studyId, handleAddClassroom, updateClassroomList}) {
  const [classroomId, setClassroomId] = useState('');
  const [classrooms, setClassrooms] = useState([]);

  //Gets all the classrooms to display in list
  useEffect(() => {
    async function fetchClassrooms() {
      try {
        const response = await getAllClassrooms();
        const classroomsData = response.data; 
        setClassrooms(classroomsData);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    }
  
    fetchClassrooms();
  }, []);
  

  //handles function for selecting a classroom, once a classroom is selected, it adds to the study
  async function handleSelectClassroom(id) {
  try {
    const response = await getClassroom(id);
    addClassroomFunc(updateClassroomList(response.data));
  } catch (error) {
    console.error('Error fetching classroom details:', error);
  }
}

//addClassroom func that uses the newClassroomList parameter to update list
  function addClassroomFunc(newCLList) {
    if (newCLList) {
      handleAddClassroom(studyId, newCLList);
      
      setClassroomId('');
    } else {
      console.error('Please select a classroom.');
    }
  }

  return (
    <div className='box'>
      {/*Adds classroom and uses the classroom id to set the selected classroom*/}
      <h2>Add a Classroom</h2>
      <div>
        <label style={{ padding: '10px' }}>Click to add a classroom: </label>
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
