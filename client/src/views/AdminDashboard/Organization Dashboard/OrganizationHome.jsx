import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import { getUser, getAllAdministrators } from "../../../Utils/requests";
import OrganizationClassroomManagement from "./OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import './Organization.less';

const { TabPane } = Tabs;

export default function OrganizationHome() {

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const navigate = useNavigate();

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
                <h1>[Organization Name]</h1>
            </div>
            <div id='home-content-container'>
                
            </div>
        </div>
    )
}