import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { createOrganization, updateOrganization, getAllAdministrators, getUser, createSchool, updateClassroom } from "../../../../Utils/requests"
import "./SchoolCreator.less"
import { AddSVG } from "../../../../assets/SVG";
import { getGrades } from "../../../../Utils/requests";


export default function SchoolCreator(props) {
    const [visible, setVisible] = useState(false)
    const [admin, setAdmin] = useState({});
    const [name, setName] = useState("")
    const [county, setCounty] = useState("")
    const [state, setState] = useState("")

    
    // Reset Form fields
    const showModal = () => {
        setState("")
        setName()
        setCounty("")
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false)
    }

    const handleSubmit = async e => {
        const createSchoolResponse = await createSchool(name, state, county, parseInt(props.organizationID))

        if (createSchoolResponse.err) {
            message.error("Failed to Create School");
        }
        else {
            setVisible(false);
            props.load();
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
    }, [])

    
    return (
        <div>
            <button onClick={showModal} id='add-school-btn'><AddSVG/>Add New School</button>
            <Modal
                title={`Create a School in ${props.schoolName}`}
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
                    <Form.Item id="form-label" label="School Name">
                        <Input
                        onChange={e => setName(e.target.value)}
                        value={name}
                        placeholder="Enter the school's name"
                        required
                        />
                    </Form.Item>

                    <Form.Item id="form-label" label="State">
                        <Input
                        onChange={e => setState(e.target.value)}
                        value={state}
                        placeholder="Enter the school's state"
                        required
                        />
                    </Form.Item>

                    <Form.Item id="form-label" label="County">
                        <Input
                        onChange={e => setCounty(e.target.value)}
                        value={county}
                        placeholder="Enter the school's county"
                        required
                        />
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
