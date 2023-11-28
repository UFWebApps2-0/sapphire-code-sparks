import { Button, Form, Input, message, Modal, Select } from "antd"
const { Option } = Select;
import React, { useEffect, useState } from "react"
import { createOrganization, updateOrganization } from "../../../../Utils/requests"
import "./OrganizationCreator.less"

export default function OrganizationCreator(props) {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState("")
  const [selectedSchools, setSelectedSchools] = useState([])
  const [schools, setSchools] = useState([])
  const [refreshSchools, setRefreshSchools] = useState(false)
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwt');

        if (!jwtToken) {
          throw new Error('No JWT token found');
        }
        const response = await fetch('http://localhost:1337/api/schools', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        const data = await response.json();
        // filter schools by those that are not already in an organization
        const filteredData = data.filter(school => school.organization === null);
        setSchools(filteredData);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, [refreshSchools]);

  const handleSchoolChange = value => {
    setSelectedSchools(value);
  };

  // Reset form fields
  const showModal = () => {
    setName("")
    setSelectedSchools([])
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleSubmit = async e => {
    const adminId = props.admins.id;
    console.log(adminId);
    
    // create new organization in database
    const createRes = await createOrganization(name);
    if (createRes.err) {
      message.error("Failed to create a new organization");
    } else {
      const newOrgId = createRes.data.id;
      console.log(newOrgId)
      message.success("Successfully created new organization");

      // update organization with selected schools
      const updateRes = await updateOrganization(newOrgId, selectedSchools, adminId);
      if(updateRes.err) {
        message.error("Failed to update organization");
      } else {
        if (props.refreshOrganizations) { // refresh organizations
          props.refreshOrganizations();
        }
        setRefreshSchools(!refreshSchools); // refresh school list
        setVisible(false); // close modal
      }
    }
  }

  return (
    <div>
      <button onClick={showModal} id="add-unit-btn">
        + Add Organization
      </button>
      <Modal
        title="Create Organization"
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
          <Form.Item id="form-label" label="Organization Name">
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Enter organization name"
              required
            />
          </Form.Item>
          <Form.Item label="Add Schools">
            <Select
              showSearch
              mode="multiple"
              placeholder="Select schools"
              onChange={handleSchoolChange}
              value={selectedSchools}
            >
            {schools.map(school => (
            <Option key={school.id} value={school.id}>{school.name}</Option>
          ))}
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
