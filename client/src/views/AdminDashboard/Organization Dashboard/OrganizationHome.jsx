import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getOrganization } from "../../../Utils/requests";
import './Organization.less';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { TrashSVG } from "../../../assets/SVG";

import "./OrganizationHome.css"


export default function OrganizationHome({ organizationId }) {
    const [organization, setOrganization] = useState({});
    const navigate = useNavigate();


    // Navigate to Organization Dashboard
    const navigateOrganizationDash = () => {
        navigate('/organization-dashboard');
    };
    

    // Load Organization's Data
    useEffect(() => {
        getOrganization(organizationId)
            .then((res) => {
                res.data ? setOrganization(res.data) : message.error('Failed to fetch organization details');
            })
            .catch((error) => {
                message.error(error.message || 'An error occurred while fetching organization details.');
            });
    }, [organizationId]);


    return (
        <div>
            <button id='home-back-btn' onClick={navigateOrganizationDash}>
                <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <div id='page-header'>
                <h1>{organization.name}</h1>
            </div>
            <div id='home-content-container' class='organization-home'>        
                <Popconfirm
                    title={`Are you sure you want to delete ${organization.name}?`}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => handleDelete(id)}
                >
                    <button id='delete-organization-button'>
                        <TrashSVG/>
                        <span>Delete Organization</span>
                    </button>
                </Popconfirm>
            </div>
        </div>
    )
}