import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators, getOrganizations } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import './OrganizationDashboard.less';

export default function OrganizationDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

    // Button to navigate to a organization just for testing
    const handleNavigation = (organizationID) => {
        navigate(`/organization/${organizationID}`); //eventually will become /organization/$organizationID
    }

    //button to navigate back to admin dashboard 
    const navigateAdminDash= () => {
        navigate('/adminDash'); 
    }

    //button to add new organization 
    const addOrganization = () => {
        //** TODO: ADD NEW ORGANIZATION FEATURE */
    }
    // Initialization
    useEffect(() => {
        getUser()
            // Load admin information
            .then((response) => {
                getAdministrator(response.data.id);
            })
            // If something went wrong, the user is redirected back to the admin login
            .catch((error) => {
                message.error(error);
                navigate('/adminLogin');
            })
    }, []);

    // Check the console to see or check the administrator
    useEffect(() => {
        if (admin == undefined || admin == null || Object.keys(admin).length == 0)
            return;
        console.log(`Logged-in Administrator: ${admin.first_name} ${admin.last_name}`, admin);

        //Stores every organizations' data
        let organizationIds = [];
        admin.organizations.forEach((organization) => {
            organizationIds.push(organization.id);
        });
        getOrganizations(organizationIds).then((organizations) => {
            setOrganizations(organizations);
        });
    }, [admin])

    // Check the console to see or check the organizations
    useEffect(() => {
        if (organizations == undefined || organizations == null || organizations.length == 0)
            return;
        console.log(`Administrator has ${organizations.length} ${organizations.length == 1 ? "organization" : "organizations"}`, organizations);
    }, [organizations])

    // Probably not the most confidential, secure, or realistic way to find the administrator
    // However, this doesn't really matter as it's not under our project's domain
    const getAdministrator = async (userID) => {
        getAllAdministrators().then((response) => {
            const admins = response.data;
            for (let i = 0; i < admins.length; i++) {
                if (admins[i].user.id === userID) {
                    setAdmin(admins[i]);
                }
            }
        })
    }

    return (
        <div className='container nav-padding'>
        <NavBar />
        <div id='head-container'> 
            <div id='main-header'>Organization Dashboard</div>
            <div id = 'top-buttons-container'>
                <div id = 'return-button'> 
                    <button onClick = {() => navigateAdminDash()}> Return to Administrator Dashboard </button>
                </div>
                <div id = 'add-org-button'> 
                    <button onClick = {() => addOrganization()}> Add New Organization </button>
                </div>
            </div>
        </div>
        <MentorSubHeader title={'Your Organizations'}></MentorSubHeader>
        <div id='organizations-container'>
          <div id='dashboard-card-container'>
            {organizations.map((organization) => (
                <div key={organization.id} id='dashboard-class-card'>
                    <div id='card-left-content-container'>
                        <h1 id='card-title'>{organization.name}</h1>
                        <div id='card-button-container' className='flex flex-row'>
                            <button onClick={() => handleNavigation(organization.id)}>
                            View
                            </button>
                        </div>
                    </div>
                <div id='card-right-content-container'>
                <div id='mentor-number-container'>
                  <h1 id='number'>{organization.mentors.length}</h1>
                  <p id='label'>Teachers</p>
                </div>
                <div id='divider' />
                <div id='school-number-container'>
                    <h1 id='number'>{organization.schools.length}</h1>
                    <p id='label'>Schools</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
        </div>
    )
}