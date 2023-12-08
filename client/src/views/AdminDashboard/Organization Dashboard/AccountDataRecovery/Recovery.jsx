import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { getSchool, getClassroom } from '../../../../Utils/requests';
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
      //retrieve array of school objects from organization prop
     
      const schools = org.schools;
      let deletedStudents = []; 

      if (schools)    {
        
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
                    let classroomDeletedStudents = students.filter(student => student.deleted);
                    //add student role and school name to each student object  
                    classroomDeletedStudents.map((student) => {
                      student.Role = "Student"; 
                      student.School = school.name; 
                    })
                    deletedStudents.push(...classroomDeletedStudents); 
                })
              })
            })
          } 
        }) 
        
        //append deleted students array to accounts array 
        setAccounts(deletedStudents); 
      }
      
    }, [org])
    
    const handleRecoverAccountProp = (selectedRowKeys) => {
      setAccounts((prevAccounts) => 
        prevAccounts.filter((account) =>!selectedRowKeys.includes(account.id))
      )
    }
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
          onRecover = {handleRecoverAccountProp}
        />
      </Modal>
    </div>
  )
}
