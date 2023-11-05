import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import {
    getOrganization,
    deleteMentor,
} from '../../../../Utils/requests';
import ListView from './ListView';
import './ClassroomManagement.less';
import { Form, message, Table } from 'antd';

export default function OrganizationClassroomManagement({ organizationId } ) {
    const [mentorData, setMentorData] = useState([]);
    const [organization, setOrganization] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

    useEffect(() => {
        let data = [];
        getOrganization(organizationId).then((res) => {
          if (res.data) {
            const organization = res.data;
            setOrganization(organization);
            organization.mentors.forEach((mentor) => {
              data.push({
                key: mentor.id,
                name: mentor.first_name + ' ' + mentor.last_name,
              });
            });
            setMentorData(data);
          } else {
            message.error(res.err);
          }
        });
    }, [organizationId]);

    const handleDelete = async (key) => {
      const dataSource = [...mentorData];
      setMentorData(dataSource.filter((item) => item.key !== key));

      const res = await deleteMentor(key);
      if (res.data) {
        message.success(`Successfully deleted mentor, ${res.data.first_name + ' ' + res.data.last_name}.`);
      } else {
        message.error(res.err);
      }
    };

    // back button
    const handleBack = () => {
        navigate('/organizationdashboard');
    }

    return (
        <div>
            <button id='home-back-btn' onClick={handleBack}>
            <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <div id='page-header'>
                <h1>Classroom Management</h1>
            </div>
            <ListView
                    mentorData={mentorData}
                    handleDelete={handleDelete}
            />
        </div>
    )
}