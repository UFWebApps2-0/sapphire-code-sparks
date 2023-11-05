import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';
import OrganizationHome from "./Organization";
import { Table } from 'antd';

export default function OrganizationModeration() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

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
                <h1>Moderation</h1>
            </div>
            <div
            id='content-creator-table-container'
            style={{ marginTop: '6.6vh' }}
            >
            <Table
            ></Table>
            </div>
        </div>
    )
}