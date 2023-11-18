import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators, getOrganizations } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import OrganizationCreator from "./OrganizationCreator/OrganizationCreator";
import './OrganizationDashboard.less';


export default function OrganizationDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [totalMentors, setTotalMentors] = useState(0);
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

    // Loads Organizations
    const fetchAndSetOrganizations = async () => {
        if (!admin || Object.keys(admin).length === 0) {
            return;
        }

        const jwtToken = localStorage.getItem('jwt');
        if (!jwtToken) {
            throw new Error('No JWT token found');
        }

        // Fetch organizations
        try {
            const orgResponse = await fetch('http://localhost:1337/api/organizations', {
                headers: { 'Authorization': `Bearer ${jwtToken}` },
            });

            const organizations = await orgResponse.json();

            // Fetch schools and mentors in parallel
            const fetchSchoolsAndMentors = async (organization) => {
                const schoolResponse = await fetch(`http://localhost:1337/api/schools?organization=${organization.id}`, {
                    headers: { 'Authorization': `Bearer ${jwtToken}` },
                });
                const schools = await schoolResponse.json();

                // Parallelize mentor fetch requests for each school
                const mentorPromises = schools.map(school =>
                    fetch(`http://localhost:1337/api/mentors?school=${school.id}`, {
                        headers: { 'Authorization': `Bearer ${jwtToken}` },
                    }).then(response => response.json())
                );

                const mentorsList = await Promise.all(mentorPromises);
                return mentorsList.flat().length; 
            };

            const mentorCounts = await Promise.all(organizations.map(fetchSchoolsAndMentors));
            mentorCounts.forEach((count, index) => {
                organizations[index].totalMentors = count;
            });

            setOrganizations(organizations);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    // Loads Organizations
    useEffect(() => {
        fetchAndSetOrganizations();
    }, [admin]);


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
                        <OrganizationCreator
                        admins = {admin}
                        refreshOrganizations = {fetchAndSetOrganizations}
                        />
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
                            <h1 id='number'>{organization.totalMentors}</h1>
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

