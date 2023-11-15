import React, { useState } from 'react';
import { HeartOutlined, HeartFilled, CopyOutlined, EditOutlined } from '@ant-design/icons';
import './GalleryView.less';
import DemoData from "../../../DemoData.json"

import './GalleryView.less';
import DemoData from "../../../DemoData.json"

export default function GalleryView({searchParams, setSearchParams, filterText, classroomId, privacySetting}){
    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );

    const [HeartIcon, setHeartIcon] = useState(HeartOutlined);
    const [CopyIcon, setCopyIcon] = useState(CopyOutlined);
    const [EditIcon, setEditIcon] = useState(EditOutlined);



    const handleOpenGallery = (id) => {
        alert("Workspace page will open");
    };

    const handleLike = (id) => {
        alert("Workspace will be liked");
        if (HeartIcon === HeartOutlined)
            setHeartIcon(HeartFilled);
        else
            setHeartIcon(HeartOutlined);
    };

    const handleCopyEdit = (id) => {
        alert("Workspace will be copied/edited");
    }


    // Set workspaceList with the entries from JSON data and filter for privacy setting
    const filteredData = DemoData.entries
        .filter((entry) => entry.privacy.toLowerCase().includes(privacySetting.toLowerCase()));

    // Filters the workspaceList based on input item name or author (not case-sensitive)
    const filteredGallery = filteredData.filter((entry) =>
        entry.author.toLowerCase().includes(filterText.toLowerCase()) |
        entry.name.toLowerCase().includes(filterText.toLowerCase()));

    // The list is displayed as cards and filters as input is typed in the search bar
    // TODO: Check margins if format looks weird
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
                    <button id='likeButton' style={{marginBottom: '0vh'}} onClick={() => handleLike(DemoData.id)}>
                        <HeartIcon size={64}/>
                    </button>
                    <button id='copy-edit-button' onClick={() => handleCopyEdit(DemoData.id)}>
                        <CopyIcon size={64} style={{marginTop: '0vh'}}/>/
                        <EditIcon size={64} style={{marginTop: '0vh'}}/>
                    </button>
                    <div id='divider' style={{marginTop: '0vh', marginBottom: '2vh'}}/>
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
}
