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


export default function GalleryView({searchParams, setSearchParams, classroomId, privacySetting}){
    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );
    
    // these will be changed to add functionality
    const handleOpenGallery = (id) => {
        alert("Workspace page will open");
    };

    const handleLike = (id) => {
        alert("Workspace will be liked");
    };

    
    // Set workspaceList with the entries from JSON data and filter for privacy setting
    const filteredData = DemoData.entries
        .filter((entry) => entry.privacy.toLowerCase().includes(privacySetting.toLowerCase()));

    // map through filtered data and display as cards
    const galleryList = filteredData.map(directory => {
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

    // return galleryList
    return (
        <div id='gallery-card-container'>
            {galleryList}
        </div>
      );
}