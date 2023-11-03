import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { getUser, getAllAdministrators } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';

export default function OrganizationDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

    // Button to navigate to a organization just for testing
    const handleNavigation = () => {
        navigate('/organization');
    }

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
            <NavBar />
            <button onClick={handleNavigation}>Example Organization</button>

        </div>
    )
}