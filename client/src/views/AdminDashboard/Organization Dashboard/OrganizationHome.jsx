import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import { getUser, getAllAdministrators } from "../../../Utils/requests";
import OrganizationClassroomManagement from "./ClassroomManagement/OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import { getOrganization } from "../../../Utils/requests";
import './Organization.less';

const { TabPane } = Tabs;

export default function OrganizationHome({ organizationId }) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [organizationName, setOrganizationName] = useState('');
    const tab = searchParams.get('tab');
    const navigate = useNavigate();

    useEffect(() => {
        getOrganization(organizationId).then((res) => {
            if (res.data) {
                setOrganizationName(res.data.name);
            } else {
                message.error('Failed to fetch organization details');
            }
        }).catch((error) => {
            message.error(error.message || 'An error occurred while fetching organization details.');
        });
    }, [organizationId]);


    // back button
    const handleBack = () => {
        navigate('/organizationdashboard');
    };

    return (
        <div>
            <button id='home-back-btn' onClick={handleBack}>
            <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <div id='page-header'>
                <h1>{organizationName}</h1>
            </div>
            <div id='home-content-container'>
                
            </div>
        </div>
    )
}