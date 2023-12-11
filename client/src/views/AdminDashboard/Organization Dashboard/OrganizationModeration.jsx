import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getOrganization, getModRecord, getModRecordCount } from "../../../Utils/requests";
import { Table } from 'antd';
import Recovery from "./AccountDataRecovery/Recovery"; 
import { message } from 'antd';
import ModLogListView from "./ModerationLogListView/ModLogListView";


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
      //console.log('useEffect triggered!');
        const fetchData = async () => {
          try {
            //get org details
            let getOrganizationResponse = await getOrganization(organizationId);
            let organizationData = getOrganizationResponse.data;
            console.log('Moderation Records:', organizationData.moderation_records);
            
            if (organizationData) {
              let _organization = getOrganizationResponse.data;
            let _mrecords = [];


          for (const OMrecord of _organization.moderation_records) {
              let getMRecordResponse = await getModRecord(OMrecord.id);
              let mrecord = getMRecordResponse.data;
              _mrecords.push({ ...mrecord, key: mrecord.id });
              
                moderationRecords[mrecord.id] = {
                  ...mrecord,
                  key: mrecord.id
                }
            }

            // Set States
            setOrganization(_organization);
            setModerationRecords(_mrecords)
            console.log('Passed Data to ModLogListView:', _mrecords);

            } else {
              message.error('Failed to fetch organization details');
            }
          } catch (error) {
            message.error(error.message || 'An error occurred while fetching organization details.');
          }
          
      //begintest

      //endtest
        };
        
        
        fetchData();
        //load();
        //console.log(moderationRecords); 
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
                <ModLogListView 
                data={Object.values(moderationRecords)} 
                orgID={organizationId}
                 />
                
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