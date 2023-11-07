import React from "react";
import { useState } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import OrganizationHome from "./OrganizationHome";
import OrganizationClassroomManagement from "./ClassroomManagement/OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import './Organization.less';


const { TabPane } = Tabs;


export default function Organization() {
    // Organization and Admin Data
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');

    // Organization ID
    const {id} = useParams();

    // Tabbing
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    
    // Navigation
    const navigate = useNavigate();


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

            </Tabs>
        </div>
    )
}