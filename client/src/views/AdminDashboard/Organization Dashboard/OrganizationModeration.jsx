import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getOrganization, getModRecord, getModRecordCount } from "../../../Utils/requests";
import { Table } from 'antd';
import Recovery from "./AccountDataRecovery/Recovery"; 
import { message } from 'antd';


export default function OrganizationModeration({ organizationId }) {
    const [organization, setOrganization] = useState({});
    const [moderationRecords, setModerationRecords] = useState([]);
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
        const fetchData = async () => {
          try {
            //get org details
            const organizationResponse = await getOrganization(organizationId);
            const organizationData = organizationResponse.data;
            
            if (organizationData) {
              setOrganization(organizationData);
              
              //get mod records
              const moderationRecordsResponse = await getModRecord(organizationId);
              const moderationRecordsData = moderationRecordsResponse.data;
              
              setModerationRecords(moderationRecordsData);

            } else {
              message.error('Failed to fetch organization details');
            }
          } catch (error) {
            message.error(error.message || 'An error occurred while fetching organization details.');
          }
        };
    
        fetchData();
        //console.log(moderationRecords); 
      }, [organizationId]);

      const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Action Type', dataIndex: 'ActionType', key: 'ActionType' },
        { title: 'Action Date', dataIndex: 'ActionDate', key: 'ActionDate' },
        { title: 'Moderator Name', dataIndex: 'ModeratorName', key: 'ModeratorName' },
      ];

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
                <Table dataSource={moderationRecords} columns={columns}a rowKey="id" />
            </div>
            
            <div class="inline-buttons">
            <button onClick={() => alert('Delete something')}>Delete Something</button>
            <button onClick={() => alert('Moderation Action')}>Moderation Action</button>
            <Recovery
              org = {organization}
            />
            </div>

        </div>
    )
}