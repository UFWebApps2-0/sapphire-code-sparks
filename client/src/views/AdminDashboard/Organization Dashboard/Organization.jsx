import React from "react";
import { useState, useEffect } from "react";
import { useGlobalState } from "../../../Utils/userState";
import { useNavigate } from 'react-router-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import OrganizationHome from "./OrganizationHome";
import OrganizationClassroomManagement from "./ClassroomManagement/OrganizationClassroomManagement";
import OrganizationModeration from "./OrganizationModeration";
import { Tabs } from 'antd';
import { getOrganization, deleteOrganization } from "../../../Utils/requests";
import { TrashSVG } from "../../../assets/SVG";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import './Organization.less';


const { TabPane } = Tabs;


export default function Organization() {
    // Organization ID
    const {id} = useParams();
    const [organization, setOrganization] = useState({});


    // Tabbing
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    
    // Navigation
    const navigate = useNavigate();

    //Handles Organization Deletion
    const handleDelete = (organizationId) => {
        deleteOrganization(organizationId);
        navigate('/organization-dashboard');
    }

    // Load Organization's Data (necessary for deletion popup message)
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

            </Tabs>
            <Popconfirm
                title={`Are you sure you want to delete ${organization.name}?`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete(id)}
              >
                <button id='delete-organization-btn'>
                    <TrashSVG/>
                    <span>Delete Organization</span>
                </button>
              </Popconfirm>

        </div>
    )
}