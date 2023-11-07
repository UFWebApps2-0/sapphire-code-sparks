import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message } from 'antd';
import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
    getAuthorizedWorkspaces,
    getClassroomWorkspace,
    getSubmission,
    deleteAuthorizedWorkspace,
  } from '../../Utils/requests';


export default function GalleryView({searchParams, setSearchParams, classroomId}){
    const [workspaceList, setWorkspaceList] = useState([]);
    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );
    useEffect(() => {
        const fetchData = async () => {
            let wsResponse;
            if(classroomId){
                wsResponse = await getClassroomWorkspace(classroomId);
            }
            else{
                wsResponse = await getAuthorizedWorkspaces();
            }

            setWorkspaceList(wsResponse.data);
        };
        fetchData();
    }, [classroomId]);

    // These attributes show up in the tables [Name---Description---Open Workspaces---Delete]
    const wsColumn = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '30%',
            align: 'left',
            render: (_, key) => key.name,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            editable: true,
            width: '40%',
            align: 'left',
            render: (_, key) => key.description,
        },
        {
            title: 'Open Workspace',
            dataIndex: 'open',
            key: 'open',
            editable: false,
            width: '20%',
            align: 'center',
            render: (_, key) => (
                <Link
                    onClick={() =>
                        localStorage.setItem('sandbox-activity', JSON.stringify(key))
                    }
                    to={'/sandbox'}
                >
                    Open
                </Link>
            ),
        },
        {
            title: 'Like',
            dataIndex: 'like',
            key: 'like',
            width: '10%',
            align: 'center',
            render: (_, key) => (
                <Popconfirm
                    title={'Like this workspace?'}
                    icon={<SmileOutlined style={{ color: 'blue' }} />}
                    onConfirm={async () => {

                        }
                    }
                >
                    <button id={'link-btn'}>
                        <HeartOutlined style={{ color: 'grey' }}/>
                    </button>
                </Popconfirm>
            ),
        },
    ];


    return (
        <div>
            <div
                id='content-creator-table-container'
                style={{ marginTop: '6.6vh' }}
            >
                <Table
                    columns={wsColumn}
                    dataSource={workspaceList}
                    rowClassName='editable-row'
                    rowKey='id'
                    onChange={(Pagination) => {
                        setPage(Pagination.current);
                        setSearchParams({ tab, page: Pagination.current });
                    }}
                    pagination={{ current: page ? page : 1 }}
                ></Table>
            </div>
        </div>
    )
}