import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { getAllAdministrators, updateMentor, getMentor, getOrganization, addMentor, getMentors, getUser, getSchool, getClassroom } from "../../../../Utils/requests"
import "./MentorCreator.less"
import { AddSVG } from "../../../../assets/SVG";


// Having authorization issues for mentor ¯\_(ツ)_/¯
// I am going to comment it out until resolved, if resolved

export default function MentorCreator(props) {
    const [visible, setVisible] = useState(false)

    // User Choice
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [classrooms, setClassrooms] = useState("")
    const [school, setSchool] = useState()
    // const [mentor, setMentor] = useState();

    // All
    const [listedClassrooms, setListedClassrooms] = useState([])
    const [allClassrooms, setAllClassrooms] = useState([])
    // const [allMentors, setAllMentors] = useState([]) // Authorization issues, just committing this code out for now
    const [allSchools, setAllSchools] = useState([])

    
    async function loadDefaults() {
        // Multiple classrooms can be chosen
        if (props.classroomID == -1) {
            // Only viewing one school
            if (props.schoolID != -1) {
                let schoolResponse = await getSchool(props.schoolID);
                if (!schoolResponse.err) {
                    // Show classrooms of school
                    setAllClassrooms(schoolResponse.data.classrooms);
                    setListedClassrooms(schoolResponse.data.classrooms);
                }
                setSchool(props.schoolID);
            }
            // Viewing all schools
            else {
                let organizationResponse = await getOrganization(props.organizationID);
                if (!organizationResponse.err) {
                    let _allSchools = [];
                    let _allClassrooms = {};

                    for (const school of organizationResponse.data.schools) {
                        _allSchools.push(school);

                        let schoolResponse = await getSchool(school.id);
                        if (!schoolResponse.err) {
                            _allClassrooms[school.id] = schoolResponse.data.classrooms;
                        }
                    }

                    setAllSchools(_allSchools);
                    setAllClassrooms(_allClassrooms);
                }
            }
        }
        else {
            // Particular classroom already chosen
            setClassrooms([props.classroomID]);

            let classroomResponse = await getClassroom(props.classroomID);
            if (!classroomResponse.err) {
                setSchool(classroomResponse.data.school.id);
            }
        }

        // let mentorsResponse = await getMentors();
        // if (!mentorsResponse.err) {
        //     setAllMentors(mentorsResponse.data);
        // }
    }


    React.useEffect(() => {
        loadDefaults();
    }, [props])


    // Reset Form fields
    const showModal = () => {
        setFirstName("");
        setLastName("");
        // setMentor(null);
        setSchool();
        setListedClassrooms([]);
        setClassrooms();
        setVisible(true);
        loadDefaults();
    }


    const handleFirstNameChange = (value) => {
        setFirstName(value);
        // setMentor(null);
    }


    const handleLastNameChange = (value) => {
        setLastName(value);
        // setMentor(null);
    }

    const handleClassroomsChange = (value) => {
        setClassrooms(value);
    }

    const handleSchoolChange = (value) => {
        if (school != value)
            setClassrooms();
        setSchool(value);
        // The listed classrooms are the classrooms of the school
        setListedClassrooms(allClassrooms[value]);
    }

    // Mentor has been omitted, so this is omitted as well
    // const handleMentorChange = (value) => {
    //     setMentor(value);
    //     setFirstName("");
    //     setLastName("");
    // }


    const handleCancel = () => {
        setVisible(false)
    }


    const handleSubmit = async e => {
        if (firstName != "" && lastName != "") {
            const addMentorResponse = await addMentor(firstName, lastName, school, classrooms, props.organizationID);

            if (!addMentorResponse.err) {
                setVisible(false);
                props.load();
            }
            else {
                message.error("Failed to Create Mentor")
            }
        }
        // Having authorization issues, I believe it's best to just not continue with this as we've ran out of time
        // else if (mentor != null) {
        //     const getMentorResponse = await getMentor(mentor);

        //     if (!getMentorResponse.err) {
        //         if (school != getMentorResponse.data.school.id) {
        //             let updateMentorResponse = await updateMentor(mentor, {"school": school, "classrooms": classrooms})
        //             if (!updateMentorResponse.err) {
        //                 setVisible(false);
        //                 props.load();
        //             }
        //             else {
        //                 message.error("Failed to Create Mentor")
        //             }
        //         }
        //         else {
        //             // Add onto classes
        //             let mentorClasses = []
        //             for (const classroom of getMentorResponse.data.classrooms) {
        //                 mentorClasses.push(classroom.id)
        //             }

        //             for (const classroom of classrooms) {
        //                 if (!mentorClasses.includes(classroom))
        //                     mentorClasses.push(classroom)
        //             }

        //             let updateMentorResponse = await updateMentor(mentor, {"school": school, "classrooms": mentorClasses})
        //             if (!updateMentorResponse.err) {
        //                 setVisible(false);
        //                 props.load();
        //             }
        //             else {
        //                 message.error("Failed to Create Mentor")
        //             }
        //         }
        //     }
        // }
    }


    return (
        <div>
            <button className='safe action' onClick={showModal}>
                <AddSVG/>
                <span>Add Mentor</span>
            </button>
            <Modal
                title={`Add Mentor to ${props.classroomName ? `Class - ${props.classroomName}` : `School - ${props.schoolName}`}`}
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
                    <Form.Item id="form-label" label="First Name">
                        <Input
                            onChange={e => handleFirstNameChange(e.target.value)}
                            value={firstName}
                            placeholder="Enter First Name"
                        />
                    </Form.Item>

                    <Form.Item id="form-label" label="Last Name">
                        <Input
                            onChange={e => handleLastNameChange(e.target.value)}
                            value={lastName}
                            placeholder="Enter Last Name"
                        />
                    </Form.Item>

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

                    {/* <span>OR</span> */}

                    {/* <Form.Item id="form-label" label="Mentor">
                        <Select
                            showSearch
                            placeholder="Select Mentor"
                            value={mentor}
                            onChange={handleMentorChange}
                        >
                            {allMentors.map((mentor) => {
                                return (
                                    <Option
                                        key={mentor.id}
                                        value={mentor.id}
                                    >
                                        {`${mentor.first_name} ${mentor.last_name}`}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Form.Item> */}

                    {/* Only allow user to select a classroom if no classroom has been selected */}
                    {props.classroomID == -1 && 
                        <Form.Item id="form-label" label="Select Classroom">
                            <Select
                                mode="multiple"
                                showSearch 
                                placeholder={`${props.schoolID == -1 && school == null ? "Please select a school first" : "Select classroom"}`}
                                value={classrooms}
                                onChange={handleClassroomsChange}
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
