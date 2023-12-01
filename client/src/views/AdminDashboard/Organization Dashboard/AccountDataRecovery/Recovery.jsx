import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import {  getSchool, getClassroom, getAllDeletedAccounts } from '../../../../Utils/requests';
import "./Recovery.less"
import AccountListView from "./AccountListView.jsx"

export default function Recovery({org}) {
    //variable for storing deleted accounts
    const [accounts, setAccounts] = React.useState([]);
    const [visible, setVisible] = React.useState(false); 
    
    const handleCancel = () => {
        setVisible(false); 
    }
    const showModal = () => {
        setVisible(true); 
    }

      
    useEffect(() => {
      
      if (org === null ) {
        // Handle the case where org is null, for example, you might want to return early or show an error message
        console.log('Error: organization is null'); 
      }
      else   {
        console.log(org); 
      }
      
      //retrieve array of school objects from org prop
      const schools = org.schools;
      schools.forEach((school) => {
        if (school !== undefined && school !== null)    {
          //get school data 
          getSchool(school.id).then(async (response) => {
            //get all classrooms for 1 school 
            const schoolClassrooms = response.data.classrooms; 
            schoolClassrooms.forEach((classroom) => {
              //get student data from each classroom 
              getClassroom(classroom.id).then(async (cl) => {
                  const students = cl.data.students;
                  //get students from database that are deleted
                  let deletedStudents = students.filter(student => student.deleted);
                  //add student role and school name to each student object  
                  deletedStudents.map((student) => {
                    student.Role = "Student"; 
                    student.School = school.name; 
                  })
                  
                  console.log(deletedStudents); 
                  //append deleted students array to accounts array 
                  setAccounts([...accounts, ...deletedStudents]); 
                  
              })
            })
          })
        }

      }) 
    }, [org])

  return (
    <div>

      <button onClick={showModal}>
        Account/Data Recovery
      </button>
      <Modal
        title="Recover Accounts/Data"
        open={visible}
        onCancel={handleCancel}
        onOk={handleCancel}

      >
        <AccountListView
          data = {accounts}
        />
      </Modal>
    </div>
  )
}
