import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { createOrganization, updateOrganization, getAllAdministrators, getUser, createClassroom, updateClassroom, getSchools } from "../../../../Utils/requests"
import "./ClassroomCreator.less"
import { AddSVG } from "../../../../assets/SVG";
import { getGrades } from "../../../../Utils/requests";


export default function ClassroomCreator(props) {
    const [visible, setVisible] = useState(false)
    const [admin, setAdmin] = useState({});
    const [classroomName, setClassroomName] = useState("")
    const [code, setCode] = useState("")
    const [grade, setGrade] = useState()
    const [availableGrades, setAvailableGrades] = useState([])
    const [school, setSchool] = useState()
    const [availableSchools, setAvailableSchools] = useState([])

    
    // Reset Form fields
    const showModal = () => {
        setClassroomName("")
        setGrade()
        setCode("")
        setSchool()
        setVisible(true)
    }

    const handleSchoolChange = (school) => {
        setSchool(school)
    }

    const handleGradeChange = (grade) => {
        setGrade(grade)
    } 

    const handleCancel = () => {
        setVisible(false)
    }

    const handleSubmit = async e => {
        const createClassroomResponse = await createClassroom(classroomName, props.schoolID == -1 ? school : parseInt(props.schoolID), parseInt(grade))

        if (createClassroomResponse.err) {
            message.error("Failed to Create Classroom");
        }
        else {
            // Set Code
            const updateClassroomResponse = await updateClassroom(createClassroomResponse.data.id, {code})
            if (updateClassroomResponse.err) {
                message.error("Failed to Add Code");
            }
            else {
                setVisible(false);
                props.load();
            }
        }
    }

    // Returns Administrator with userID
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

        getGrades().then((response) => {
            if (!response.err)
                setAvailableGrades(response.data);
        })

        getSchools().then((response) => {
            if (!response.err)
                setAvailableSchools(response.data)
        })
    }, [])

    
    return (
        <div>
            <button onClick={showModal} >
                <AddSVG/>
                <span>Add Classroom</span>
            </button>
            <Modal
                title={`Create a Classroom in ${props.schoolName}`}
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
                    <Form.Item id="form-label" label="Classroom Name">
                        <Input
                        onChange={e => setClassroomName(e.target.value)}
                        value={classroomName}
                        placeholder="Enter the classroom's name"
                        required
                        />
                    </Form.Item>

                    <Form.Item id="form-label" label="Code">
                        <Input
                        onChange={e => setCode(e.target.value)}
                        value={code}
                        placeholder="Enter the classroom's code"
                        required
                        />
                    </Form.Item>

                    {props.schoolID == -1 && 
                        <Form.Item id="form-label" label="School">
                            <Select
                                showSearch 
                                placeholder="Select school"
                                onChange={handleSchoolChange}
                                value={school}
                            >
                                {availableSchools.map(aSchool => {
                                    return (
                                        <Option key={aSchool.id} value={aSchool.id}>{aSchool.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item label="Select Grade">
                        <Select
                            showSearch 
                            placeholder="Select grade"
                            onChange={handleGradeChange}
                            value={grade}
                        >
                            {availableGrades.map(aGrade => {
                                return (
                                    <Option key={aGrade.id} value={aGrade.id}>{aGrade.name}</Option>
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
