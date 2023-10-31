import React, { useState } from 'react';
import { Form, Input } from "antd"
import './ChallengeCreation.less';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import {
  getActivityToolboxAll,
} from "../../../Utils/requests"

export default function ChallengeCreation() {
  const defaultChallengeData = {
    name: '',
    badge: 0,
    description: '',
  };

  const [challengeData, setChallengeData] = useState(defaultChallengeData);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();

  const handleViewActivityTemplate = async () => {
    // FIXME: Navigate with specific SELECTED information
    console.log("Navigating to activity template page not yet implemented");
    
    const allToolBoxRes = await getActivityToolboxAll();
    const selectedToolBoxRes = await getActivityToolboxAll();
    let activity = {
      selectedToolbox: selectedToolBoxRes.data.toolbox,
      toolbox: allToolBoxRes.data.toolbox,
      lesson_module_name: challengeData.name,
      is_challenge: true,
    }
    localStorage.setItem("my-activity", JSON.stringify(activity));
    navigate("/activity");
  }

  const handleSave = () => {
          // FIXME: Save information to database
          console.log("Saving challenge to database not yet implemented")
    }

  const navigateToAssignChallenge = () => {
    // FIXME: Navigate to assign challenge page
    console.log("Navigating to assign challenge page not yet implemented")
  }

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Edit challenge details</div>
      <div id='creation-container-grid'>
        <div id='creation-container'>
          <p></p>
          <Form
            id="challenge-detail-editor"
            layout="horizontal"
            size="default"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
          >
            <Form.Item id="form-label">
              <p>PLACEHOLDER FOR BADGE SELECTION</p>
            </Form.Item>
            <Form.Item id="form-label" label="Challenge Title">
              <Input.TextArea
                onChange={e => setChallengeData({...challengeData, name: e.target.value})}
                value={challengeData.name}
                required
                placeholder="Enter challenge title..."
              ></Input.TextArea>
            </Form.Item>
            
            <Form.Item id="form-label" label="Challenge Description">
              <Input.TextArea
                onChange={e => setChallengeData({...challengeData, description: e.target.value})}
                value={challengeData.description}
                required
                placeholder="Enter challenge description..."
              ></Input.TextArea>
            </Form.Item>

            <Form.Item
              id="form-label"
              wrapperCol={{
                span: 30,
              }}
            >
              <button onClick={handleViewActivityTemplate}>Edit Challenge Activity</button>
            </Form.Item>
            <Form.Item
              id="form-label"
              wrapperCol={{
                span: 30,
              }}
            >
              <button onClick={handleSave}>Save Challenge</button>
              <button onClick={navigateToAssignChallenge}>Continue Assigning Challenge to Classrooms</button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
