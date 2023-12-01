import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { getAllAdministrators, updateStudent, getUser, getSchool, addStudent, getAllStudents, getClassroom, getOrganization } from "../../../../Utils/requests"
import "./StudentCreator.less"
import { AddSVG } from "../../../../assets/SVG";
import { getGrades } from "../../../../Utils/requests";


export default function StudentCreator(props) {
    const [visible, setVisible] = useState(false)
    const [admin, setAdmin] = useState({});

    // User Choice
    const [name, setName] = useState("")
    const [character, setCharacter] = useState("")
    const [classroom, setClassroom] = useState("")
    const [existingStudent, setExistingStudent] = useState(null)
    const [school, setSchool] = useState()

    // All
    const [listedClassrooms, setListedClassrooms] = useState([])
    const [allClassrooms, setAllClassrooms] = useState([])
    const [allStudents, setAllStudents] = useState([])
    const [allSchools, setAllSchools] = useState([])

    
    async function loadDefaults() {
        // If classroomID != -1 => classroomID already chosen, no need to load
        if (props.classroomID == -1) {
            // If schoolID != -1 => schoolID already chosen, no need to load all schools
            if (props.schoolID != -1) {
                let schoolResponse = await getSchool(props.schoolID);
                if (!schoolResponse.err) {
                    // The listed classrooms are all the classrooms of the school
                    setAllClassrooms(schoolResponse.data.classrooms);
                    setListedClassrooms(schoolResponse.data.classrooms);
                }
            }
            // Load all schools and classrooms of each school
            else {
                let organizationResponse = await getOrganization(props.organizationID);
                if (!organizationResponse.err) {
                    let allSchoolsData = []
                    let allClassroomsData = {}

                    for (const school of organizationResponse.data.schools) {
                        allSchoolsData.push(school);

                        let schoolResponse = await getSchool(school.id)
                        if (!schoolResponse.err) {
                            allClassroomsData[school.id] = schoolResponse.data.classrooms;
                        }
                    }

                    setAllSchools(allSchoolsData)
                    setAllClassrooms(allClassroomsData)
                }
            }
        }
        else {
            setClassroom(props.classroomID);
            
            let classroomResponse = await getClassroom(props.classroomID);
            if (!classroomResponse.err)
                setSchool(classroomResponse.data.school.id)
        }

        // Get all students w/o a class
        let studentsResponse = await getAllStudents();
        if (!studentsResponse.err) {
            let students = studentsResponse.data;
            students = students.filter((student) => student.classroom == null)
            setAllStudents(students);
        }
    }

    React.useEffect(() => {
        loadDefaults();
    }, [props])


    const showModal = () => {
        setCharacter("")
        setName("")

        // The pre-selected classroom is cleared by this function, so I am setting it again here
        if (props.classroomID != -1)
            setClassroom(props.classroomID)
        else
            setClassroom()
        
        setSchool()
        setExistingStudent(null)
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false)
    }

    const handleNameChange = (value) => {
        setName(value);
        setExistingStudent(null);
    }

    const handleCharacterChange = (value) => {
        setCharacter(value);
        setExistingStudent(null);
    }

    const handleClassroomChange = (value) => {
        setClassroom(value);
    }

    const handleExistingStudentChange = (value) => {
        setExistingStudent(value)
        setName("")
        setCharacter("")
    }

    const handleSchoolChange = (value) => {
        setSchool(value);
        // The listed classrooms are the classrooms of the school
        setListedClassrooms(allClassrooms[value]);
    }

    const handleSubmit = async e => {
        if (name != "" && character != "" && classroom != null) {
            let addStudentResponse = await addStudent(name, character, classroom);
            if (addStudentResponse.err) {
                message.error("Failed to Create Student");
            }
            else {
                setVisible(false);
                props.load();
            }
        }
        else if (existingStudent != null) {
            let createStudentResponse = await updateStudent(existingStudent, {classroom})
            if (createStudentResponse.err) {
                message.error("Failed to Set Student");
            }
            else {
                setVisible(false);
                props.load();
            }
        }
    }

    const getAdministrator = async (userID) => {
        getAllAdministrators().then((response) => {
            const admins = response.data;
            for (let i = 0; i < admins.length; i++) {
                if (admins[i].user.id === userID) {
                    setAdmin(admins[i]);
                }
            }
        })
    }
    
    useEffect(() => {
        getUser()
                .then((response) => {
                    getAdministrator(response.data.id);
                })
                .catch((error) => {
                    message.error(error);
                    navigate('/adminlogin');
                })
    }, [])

    
    return (
        <div>
            <button className='safe action' onClick={showModal}>
                <AddSVG/>
                <span>Add Student</span>
            </button>
            <Modal
                title={`Add Student to ${props.classroomName ? `Class - ${props.classroomName}` : `School - ${props.schoolName}`}`}
                open={visible}
                width="40vw"
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                    onFinish={handleSubmit}
                    layout="horizontal"
                    size="default"
                >
                    <span id="or-tag">Create Student</span>

                    <Form.Item id="form-label" label="Student Name">
                        <Input
                            onChange={e => handleNameChange(e.target.value)}
                            value={name}
                            placeholder="Enter the student's name"
                        />
                    </Form.Item>

                    <Form.Item id="form-label" label="Student Character">
                        <Input
                            onChange={e => handleCharacterChange(e.target.value)}
                            value={character}
                            placeholder="Enter the student's character"
                        />
                    </Form.Item>

                    <span id="or-tag">Or Select Student</span>

                    <Form.Item id="form-label" label="Select Student">
                        <Select
                            showSearch 
                            placeholder="Select student"
                            value={existingStudent}
                            onChange={handleExistingStudentChange}
                        >
                            {allStudents.map((student) => {
                                return (
                                    <Option
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <span id="or-tag">Select Classroom</span>
                    {/* Only allow user to select schools if all schools and classrooms are showing */}
                    {(props.schoolID == -1 && props.classroomID == -1) && 
                        <Form.Item id="form-label" label="Select School">
                            <Select
                                showSearch
                                placeholder="Select school"
                                value={school}
                                onChange={handleSchoolChange}
                            >
                                {allSchools.map((school) => {
                                    return (
                                        <Option
                                            key={school.id}
                                            value={school.id}
                                        >
                                            {school.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    }
                    
                    {/* Only allow user to select a classroom if no classroom has been selected */}
                    {props.classroomID == -1 && 
                        <Form.Item id="form-label" label="Select Classroom">
                            <Select
                                showSearch 
                                placeholder={`${props.schoolID == -1 && school == null ? "Please select a school first" : "Select classroom"}`}
                                value={classroom}
                                onChange={handleClassroomChange}
                            >
                                {listedClassrooms.map((classroom) => {
                                    return (
                                        <Option
                                            key={classroom.id}
                                            value={classroom.id}
                                        >
                                            {classroom.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                    </Form.Item>
                    }


                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                        style={{ marginBottom: "0px" }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="content-creator-button"
                        >
                            Submit
                        </Button>

                        <Button
                            onClick={handleCancel}
                            size="large"
                            className="content-creator-button"
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
