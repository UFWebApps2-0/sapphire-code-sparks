import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { getAllAdministrators, updateStudent, getUser, getSchool, addStudent, getAllStudents } from "../../../../Utils/requests"
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
    const [allClassrooms, setAllClassrooms] = useState([])
    const [allStudents, setAllStudents] = useState([])
    const [allSchools, setAllSchools] = useState([])

    
    async function loadDefaults() {
        // Left Here
        let schoolResponse = await getSchool(props.schoolID);
        if (!schoolResponse.err)
            setAllClassrooms(schoolResponse.data.classrooms);

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
        setClassroom()
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

    const handleSubmit = async e => {
        if (name != "" && character != "") {
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
            <button onClick={showModal}>
                <AddSVG/>
                <span>Add Student</span>
            </button>
            <Modal
                title={`Add Student to ${props.schoolName}`}
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

                    <span>OR</span>

                    <Form.Item label="Select Student">
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

                    <Form.Item label="Select Classroom">
                        <Select
                            showSearch 
                            placeholder="Select classroom"
                            value={classroom}
                            onChange={handleClassroomChange}
                        >
                            {allClassrooms.map((classroom) => {
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
