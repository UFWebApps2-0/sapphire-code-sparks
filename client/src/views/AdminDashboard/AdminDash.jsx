import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators } from "../../Utils/requests";
import NavBar from '../../components/NavBar/NavBar';

export default function AdminDash() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

    // Button to navigate to organization dashboard -- mainly for demo / testing purposes
    const handleNavigation = () => {
        navigate('/organizationdashboard');
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
        setOrganizations(admin.organizations);
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
            <div id='main-header'>Welcome {admin.first_name}</div>
            <NavBar />
            <button onClick={handleNavigation}>Organization Dashboard</button>
        </div>
    )
}