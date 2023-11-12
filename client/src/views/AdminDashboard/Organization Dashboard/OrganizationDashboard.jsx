import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators, getOrganizations } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import './OrganizationDashboard.less';


export default function OrganizationDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();


    // Navigates to the Organization w Matching ID
    const navigateOrganization = (organizationID) => {
        navigate(`/organization/${organizationID}`);
    }


    // Navigates to Admin Dashboard 
    const navigateAdminDash = () => {
        navigate('/admin-dashboard'); 
    }


    // Adds New Organization 
    const addOrganization = () => {
        //** TODO: ADD NEW ORGANIZATION FEATURE **//
    }


    // Loads Administrator
    useEffect(() => {
        getUser()
            .then((response) => {
                getAdministrator(response.data.id);
            })
            .catch((error) => {
                message.error(error);
                navigate('/adminlogin');
            })
    }, []);


    // Loads Admin's Organizations
    useEffect(() => {
        if (admin == null || Object.keys(admin).length == 0)
            return;

        let organizationIds = [];
        admin.organizations.forEach((organization) => {
            organizationIds.push(organization.id);
        });
        
        getOrganizations(organizationIds).then((organizations) => {
            setOrganizations(organizations);
        });
    }, [admin])


    // Returns Administrator with userID
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
                <div id='top-buttons-container'>
                    <div id='return-button'> 
                        <button onClick={() => navigateAdminDash()}>Return to Administrator Dashboard</button>
                    </div>
                    <div id='add-org-button'> 
                        <button onClick={() => addOrganization()}>Add New Organization</button>
                    </div>
                </div>
            </div>
            <MentorSubHeader title={'Your Organizations'}></MentorSubHeader>
            <div id='organizations-container'>
                <div id='dashboard-card-container'>

                    {/* Generating the Organization Cards */}
                    {organizations.map((organization) => (
                        <div key={organization.id} id='dashboard-class-card'>
                            <div id='card-left-content-container'>
                                <h1 id='card-title'>{organization.name}</h1>
                                <div id='card-button-container' className='flex flex-row'>
                                    <button onClick={() => navigateOrganization(organization.id)}>View</button>
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