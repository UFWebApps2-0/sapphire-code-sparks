import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message } from 'antd';
import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
    getAuthorizedWorkspaces,
    getClassroomWorkspace,
    deleteAuthorizedWorkspace,
  } from '../../Utils/requests';

import './GalleryView.less';
import DemoData from "../../../DemoData.json"

import MentorSubHeader from '../MentorSubHeader/MentorSubHeader';


export default function GalleryView({searchParams, setSearchParams, filterText, classroomId, privacySetting}){
    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );

    const handleOpenGallery = (id) => {
        alert("Workspace page will open");
    };

    const handleLike = (id) => {
        alert("Workspace will be liked");
    };


    // Set workspaceList with the entries from JSON data and filter for privacy setting
    const filteredData = DemoData.entries
        .filter((entry) => entry.privacy.toLowerCase().includes(privacySetting.toLowerCase()));

    const filteredGallery = filteredData.filter((entry) =>
        entry.author.toLowerCase().includes(filterText.toLowerCase()) |
        entry.name.toLowerCase().includes(filterText.toLowerCase()));


    /*useEffect(() => {
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

    const wsColumn = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          editable: true,
          width: '20%',
          align: 'center',
          render: (_, key) => key.name,
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          editable: true,
          width: '40%',
          align: 'center',
          render: (_, key) => key.description,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            editable: true,
            width: '40%',
            align: 'left',
            render: (_, key) => key.author,
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
    ];*/

    const galleryList = filteredGallery.map(directory => {
        return (
            <div key={directory.id} id='gallery-class-card'>
                <div id='card-left-content-container'>
                    <h1 id='card-title'>{directory.name}</h1>
                    <h1 id='card-title'>Created by: {directory.author}</h1>
                    <div id='card-button-container' className='flex flex-row'>
                        <button onClick={() => handleOpenGallery(DemoData.id)}>
                            Open
                        </button>
                    </div>
                </div>
                <div id='card-right-content-container'>
                    <button id='likeButton' onClick={() => handleLike(DemoData.id)}>
                        <HeartOutlined size={64}/>
                    </button>
                    <div id='divider' />
                    <div id='student-number-container'>
                        <h1 id='number'>0</h1>
                        <p id='label'>Views</p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div id='gallery-card-container'>
            {galleryList}
        </div>
    );

    /*return (
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
    )*/
}
