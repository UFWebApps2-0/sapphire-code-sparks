import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getOrganization } from "../../../Utils/requests";
import { Table } from 'antd';
import Recovery from "./AccountDataRecovery/Recovery"; 


export default function OrganizationModeration({ organizationId }) {
    const [organization, setOrganization] = useState({});
    const navigate = useNavigate();


    // Navigate to Organization Dashboard
    const navigateOrganizationDash = () => {
        navigate('/organization-dashboard');
    };


    const navigateRemoveAccount = () => {
        
    }
    
    const navigateModerationAction = () => {
        
    } 

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
                <h1>Moderation</h1>
            </div>
            <div
                id='content-creator-table-container'
                style={{ marginTop: '6.6vh' }}
            >
                <Table>
                </Table>
            </div>

            <div> 
                <button>
                    Remove/delete acccount
                </button>
                <div>
                    <Recovery/>
                </div>
                <button> 
                    Moderation action 
                </button> 

            </div>
        </div>
    )
}