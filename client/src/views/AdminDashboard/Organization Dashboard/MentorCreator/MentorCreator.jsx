import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { getAllAdministrators, updateMentor, getMentors, getUser, getSchool } from "../../../../Utils/requests"
import "./MentorCreator.less"
import { AddSVG } from "../../../../assets/SVG";


// This doesn't function correctly, so I had to comment out some (a lot of) lines  but ¯\_(ツ)_/¯

export default function MentorCreator(props) {
    const [visible, setVisible] = useState(false)
    const [admin, setAdmin] = useState({});

    // User Choice
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [classrooms, setClassrooms] = useState("")
    // const [user, setUser] = useState(null)
    // const [mentor, setMentor] = useState(null);

    // All
    const [allClassrooms, setAllClassrooms] = useState([])
    // const [allUsers, setAllUsers] = useState([])
    // const [allMentors, setAllMentors] = useState([])

    
    async function loadDefaults() {
        // Load Classrooms
        // let schoolResponse = await getSchool(props.schoolID);
        // if (!schoolResponse.err)
            // setAllClassrooms(schoolResponse.data.classrooms);

        // // Load Users
        // let usersResponse = await getUsers();
        // if (!usersResponse.err) {
        //     // Extracting classroom managers
        //     usersResponse.data = usersResponse.data.filter((userData) => userData.role.name == 'Classroom Manager');
        //     console.log("Classroom Managers", usersResponse.data)
        // }

        // Load Mentors
        // let mentorsResponse = await getMentors();
        // if (!mentorsResponse.err) {
            // let mentorUserIDs = [];
            // let classlessMentors = [];

            // for (const mentorData of mentorsResponse.data) {
                // console.log("Mentor Data", mentorData)
                // mentorUserIDs.push(mentorData.user.id);

                // Mentor w/ no classroom
                // if (mentorData.classrooms.length == 0) {
                    // classlessMentors.push(mentorData)
                // }
            // }
            // console.log("Mentors Data", mentorsResponse.data);
            // console.log("Mentor User IDs", mentorUserIDs)

            // // Filter out the users that are already associated w/ a mentor
            // usersResponse.data = usersResponse.data.filter((userData) => !mentorUserIDs.includes(userData.id))
            // console.log("Users w No Mentor", usersResponse.data)


            // setAllUsers(usersResponse.data)
            // setAllMentors(classlessMentors)
        // }
    }


    React.useEffect(() => {
        loadDefaults();
    }, [props])


    // Reset Form fields
    const showModal = () => {
        setFirstName("")
        setLastName("")
        // setMentor(null)
        setClassrooms()
        // setUser()
        setVisible(true)
    }


    const handleFirstNameChange = (value) => {
        setFirstName(value);
        setMentor(null);
    }


    const handleLastNameChange = (value) => {
        setLastName(value);
        setMentor(null);
    }


    // const handleUserChange = (value) => {
    //     setUser(value);
    //     setMentor(null);
    //     console.log(value)
    // }


    const handleClassroomChange = (value) => {
        setClassrooms(value);
    }


    // const handleMentorChange = (value) => {
    //     // setMentor(value);
    //     setFirstName("");
    //     setLastName("");
    //     setClassrooms();
    //     // setUser(null);
    // }


    const handleCancel = () => {
        setVisible(false)
    }


    const handleSubmit = async e => {
        // if (firstName != "" && lastName != "" && user != null && classrooms) {
        //     console.log(firstName, lastName, props.schoolID, user, classrooms)
        //     const addMentorResponse = await addMentor(firstName, lastName, props.schoolID, user, classrooms);
        //     if (!addMentorResponse.err) {
        //         setVisible(false);
        //         props.load();
        //     }
        //     else {
        //         message.error("Failed to Create Mentor");
        //     }
        // }
        // if (mentor != null && classrooms != null) {
        //     const updateMentorResponse = await updateMentor(mentor, {school: props.schoolID, classrooms})

        //     if (!updateMentorResponse.err) {
        //         setVisible(false);
        //         props.load();
        //     }
        //     else {
        //         message.error("Failed to Update Mentor");
        //     }
        // }
        // else {
        //     message.error("Please enter all information.")
        // }
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
                <span>Add Mentor</span>
            </button>
            <Modal
                title={`Add Mentor to ${props.schoolName}`}
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

                    {/* <Form.Item id="form-label" label="User">
                        <Select
                            showSearch
                            placeholder="Select User"
                            value={user}
                            onChange={handleUserChange}
                        >
                            {allUsers.map((user) => {
                                return (
                                    <Option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.email}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <span>OR</span> */}

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

                    <Form.Item label="Select Classrooms">
                        <Select
                            showSearch 
                            mode="multiple"
                            placeholder="Select Classrooms"
                            value={classrooms}
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
