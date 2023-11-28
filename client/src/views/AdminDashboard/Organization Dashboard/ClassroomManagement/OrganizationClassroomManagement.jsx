import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getOrganization, deleteMentor } from '../../../../Utils/requests';
import './ClassroomManagement.less';
import { message } from 'antd';
import { Maneuver } from "../Maneuver/Maneuver";
import '../Maneuver/Maneuver.css'


export default function OrganizationClassroomManagement({ organizationId } ) {
    const [organization, setOrganization] = useState({});
    const navigate = useNavigate();

    
    const navigateOrganizationDash = () => {
      navigate('/organization-dashboard');
    }
    

    // Loading Organization, Mentors
    useEffect(() => {
      let data = [];

      getOrganization(organizationId).then((res) => {
        if (res.data) {
          // Setting the Organization
          const organization = res.data;
          setOrganization(organization);
        } 
        else {
          message.error(res.err);
        }
      });
    }, [organizationId]);


    function updateOrganization() {
      getOrganization(organizationId).then((res) => {
        if (res.data) {
          const organization = res.data;
          setOrganization(organization);
        }
      })
    }


    return (
        <div>
            <button id='home-back-btn' onClick={navigateOrganizationDash}>
              <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <Maneuver 
              organizationId={organizationId}
              updateOrganization={updateOrganization}
              organization={organization}
            />
        </div>
    )
}

