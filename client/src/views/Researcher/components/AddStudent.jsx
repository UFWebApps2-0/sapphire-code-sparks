import React, { useState, useEffect } from 'react';
import { getAllStudents, getStudent } from '../../../Utils/requests';
//random commment

function AddStudent({studyId, handleAddStudent, studentList, updateStudentList}) {
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState([]);
  

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getAllStudents();
        const studentsData = response.data;
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    }
  
    fetchStudents();
  }, []);
  

  async function handleSelectStudent(id) {
  try {
    const response = await getStudent(id);  
    addStudentFunc(updateStudentList(response.data));
  } catch (error) {
    console.error('Error fetching student details:', error);
  }
}


  function addStudentFunc(newStudentList) {
    if (newStudentList) {
      handleAddStudent(studyId, newStudentList);
      setClassroomId('');
    } else {
      console.error('Please select a student.');
    }
  }


  return (
    <div className='box'>
      <h2>Add a Student</h2>
      <div>
        <label style={{ padding: '10px' }}>Click to add a student:</label>
        <select
  value={studentId}
  onChange={(e) => {
    setStudentId(e.target.value);
    handleSelectStudent(e.target.value);
  }}
>
  <option value="" disabled>
    -- Select Student --
  </option>
  {students.map((student) => (
      <option key={student.id} value={student.id}>
        {student.name}
      </option>
    ))}
</select>

      </div>
    
    </div>
  );
}

export default AddStudent;
