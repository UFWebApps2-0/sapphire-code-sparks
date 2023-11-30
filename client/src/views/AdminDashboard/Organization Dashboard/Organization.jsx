import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import OrganizationHome from "./OrganizationHome";
import OrganizationClassroomManagement from "./ClassroomManagement/OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import { getOrganization } from "../../../Utils/requests";
import './Organization.less';
import Gallery from "./Gallery"


const { TabPane } = Tabs;


export default function Organization() {
    // Organization ID
    const {id} = useParams();
    const [organization, setOrganization] = useState({});


    // Tabbing
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');


    // Load Organization's Data
    // Necessary for Deletion Popup Message
    // Question: Can other administrator's access the organizations of other admin's via the URL parameters?
    useEffect(() => {
        getOrganization(id)
            .then((res) => {
                res.data ? setOrganization(res.data) : message.error('Failed to fetch organization details');
            })
            .catch((error) => {
                message.error(error.message || 'An error occurred while fetching organization details.');
            });
    }, [id]);


    return (
        <div className='container nav-padding'>
            <NavBar isMentor={true}/>
            <Tabs
                defaultActiveKey={tab ? tab : 'home'}
                onChange={(key) => setSearchParams({ tab: key })}
            >
                {/* Organization Home */}
                <TabPane tab='Home' key='home'>
                    <OrganizationHome
                        organizationId={parseInt(id)}
                    />
                </TabPane>

                {/* Organization Classroom Management */}
                <TabPane tab='Classroom Management' key='classroom_management'>
                    <OrganizationClassroomManagement
                        organizationId={parseInt(id)}
                    />
                </TabPane>

                {/* Organization Moderation */}
                <TabPane tab='Moderation' key='moderation'>
                    <OrganizationModeration
                        organizationId={parseInt(id)} 
                    />
                </TabPane>

                {/* Gallery */}
                <TabPane tab='Gallery' key='gallery'>
                    <Gallery/>
                </TabPane>
            </Tabs>
        </div>
    )
}