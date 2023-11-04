import React, { useState, useEffect } from 'react';
import { message, Form, Input } from "antd"
import './ChallengeCreation.less';
import NavBar from '../../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import {
  getActivityToolbox,
  getActivityToolboxAll,
  createActivity,
  createChallenge,
  updateChallengeActivity,
  updateChallengeDetails,
  getChallengeDetails,
  getMentor,
} from "../../../Utils/requests"

export default function ChallengeCreation() {
  const defaultChallengeData = {
    name: '',
    badge_id: 'id_0',
    description: '',
  };

  const [challengeData, setChallengeData] = useState(defaultChallengeData);
  const [challengeId, setChallengeId] = useState(null);
  const [mentorId, setMentorId] = useState(null);
  const navigate = useNavigate();

  // Ensures that non-mentors are navigated away from this page
  useEffect(() => {
    getMentor().then((res) => {
      if (res.data) {
        setMentorId(res.data.id);
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    })
  }, []);

  // Returns the activity object associated with an challenge if one is found to already exist.
  // Creates a new activity and associates it with a challenge if necessary.
  // Returns null if there is a failure to retrieve a linked activity.
  // Note that it must have 'currentChallengeId' passed to it because it is called before 'challengeId' fully updates in the components state
  const getChallengeActivity = async (currentChallengeId) => {
    const challengeDetailsResponse = await getChallengeDetails(currentChallengeId);
    if (challengeDetailsResponse.err) {
      message.error(challengeDetailsResponse.err);
    } else {
      let activity = challengeDetailsResponse.data.activity;
      if (activity == null) {
        // 0 is always passed in for the activity number because there should only be one activity associated with any challenge
        // 'null' is passed in for the learning standard because it is assumed a challenge will not correspond to any particular standard
        const createActivityResponse = await createActivity(0, null);
        if (createActivityResponse.err) {
          message.error(createActivityResponse.err);
        } else {
          const createdActivityId = createActivityResponse.data.id;
          const updateChallengeActivityResponse = await updateChallengeActivity(currentChallengeId, createdActivityId);
          if (updateChallengeActivityResponse.err) {
            message.error(updateChallengeActivityResponse.err);
          } else {
            const updatedChallengeDetailsResponse = await getChallengeDetails(currentChallengeId);
            if (updatedChallengeDetailsResponse.err) {
              message.error(updatedChallengeDetailsResponse.err);
            } else {
              activity = updatedChallengeDetailsResponse.data.activity;
            }
          }
        }
      }
      return activity;
    }
    return null;
  }

  const handleViewActivityTemplate = async () => {
    const savedChallengeId = await handleSaveChallengeDetails();
    if (savedChallengeId != null) {
      let activity = await getChallengeActivity(savedChallengeId);
      if (activity != null) {
        const allToolBoxRes = await getActivityToolboxAll();
        const selectedToolBoxRes = await getActivityToolbox(activity.id);
        activity.selectedToolbox = selectedToolBoxRes.data.toolbox;
        activity.toolbox = allToolBoxRes.data.toolbox;

        // 'lesson_module_name' determines what the name of the activity will be in activity view, so it is just set to the name of the challenge
        activity.lesson_module_name = challengeData.name;
        localStorage.setItem("my-activity", JSON.stringify(activity));
        navigate("/activity");
      }
    }
  }

  // Returns the challenge id if the save was successful, and null otherwise
  const handleSaveChallengeDetails = async () => {
    if (challengeData.name != '' && challengeData.description != '') {
      let response = null;
      if (challengeId == null) {
        response = await createChallenge(mentorId, challengeData.name, challengeData.description, challengeData.badge_id);
      } else {
        response = await updateChallengeDetails(challengeId, challengeData.name, challengeData.description, challengeData.badge_id);
      }
      if (response.err) {
        message.error(response.err)
      } else {
        const savedChallengeId = response.data.id;
        setChallengeId(savedChallengeId);
        return savedChallengeId;
      }
    }
    return null;
  }

  const navigateToAssignChallenge = async () => {
    // TODO(sapphire2a): Navigate to assign challenge page
    message.error("Sorry, this is still under development.")
  }

  // Note: This only displays if a mentor id is found so that users that are not mentors/teachers will not be able to see the challenge creation form, even when they navigate to the challenge creation page
  const challengeCreationContainerForm = mentorId == null ?
  (<div></div>) :
  (
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
            <button onClick={handleSaveChallengeDetails}>Save Challenge</button>
            <button onClick={navigateToAssignChallenge}>Continue Assigning Challenge to Classrooms</button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Edit challenge details</div>
      {challengeCreationContainerForm}
    </div>
  );
}
