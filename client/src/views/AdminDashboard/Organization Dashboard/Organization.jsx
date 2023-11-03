import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import { getUser, getAllAdministrators } from "../../../Utils/requests";
import NavBar from '../../../components/NavBar/NavBar';
import OrganizationHome from "./OrganizationHome";
import OrganizationClassroomManagement from "./OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import './Organization.less';

const { TabPane } = Tabs;

export default function Organization() {
    const [organizations, setOrganizations] = useState([]);
    const [admin, setAdmin] = useState({});
    const [value] = useGlobalState('currUser');
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');

    return (
        <div className='container nav-padding'>
            <NavBar isMentor={true}/>
            <Tabs
                defaultActiveKey={tab ? tab : 'home'}
                onChange={(key) => setSearchParams({ tab: key })}
            >
            <TabPane tab='Home' key='home'>
            <OrganizationHome
            />
            </TabPane>
            <TabPane tab='Classroom Management' key='classroom_management'>
            <OrganizationClassroomManagement
            />
            </TabPane>
            <TabPane tab='Moderation' key='moderation'>
            <OrganizationModeration
            />
            </TabPane>
            </Tabs>
        </div>
    )
}