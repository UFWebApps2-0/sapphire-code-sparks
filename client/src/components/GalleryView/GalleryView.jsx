import React, { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './GalleryView.less';
import DemoData from '../../../DemoData.json';
import ProjectPage from '../ProjectPage/ProjectPage';
import placeholderImage from "../../assets/placeholder-gallery-image1.jpg";
//import { getGalleryActivity } from '@utils/requests';

export default function GalleryView({searchParams,setSearchParams,filterText,classroomId, privacySetting,}) {
    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );
    

    // Modify the state management for each gallery
    const [galleryStates, setGalleryStates] = useState(
        DemoData.entries.map(() => ({
            HeartIcon: HeartOutlined,
            ProjectPageBtn: false,
        }))
    );

    const handleOpenGallery = (index, value) => {
        setGalleryStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[index] = { ...prevStates[index], ProjectPageBtn: value };
            return updatedStates;
        });
    };

    const handleLike = (index) => {
        setGalleryStates((prevStates) => {
            const updatedStates = [...prevStates];
            const newHeartIcon =
                prevStates[index].HeartIcon === HeartOutlined
                    ? HeartFilled
                    : HeartOutlined;
            updatedStates[index] = { ...prevStates[index], HeartIcon: newHeartIcon };
            return updatedStates;
        });
    };

    // Set workspaceList with the entries from JSON data and filter for privacy setting
    const filteredData = DemoData.entries.filter((entry) =>
        entry.privacy.toLowerCase().includes(privacySetting.toLowerCase())
    );

    // Filters the workspaceList based on input item name or author (not case-sensitive)
    const filteredGallery = filteredData.filter(
        (entry) =>
            entry.author.toLowerCase().includes(filterText.toLowerCase()) ||
            entry.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // The list is displayed as cards and filters as input is typed in the search bar
    // TODO: Check margins if format looks weird
    const galleryList = filteredGallery.map((directory, index) => {
        const {
            HeartIcon: GalleryHeartIcon,
            ProjectPageBtn: ProjectPageBtnState,
        } = galleryStates[index];

        return (
            <div key={directory.id} id='gallery-class-card'>
                <div id='card-upper-content-container' onClick={() => handleOpenGallery(index, true)}>
                    <img src={placeholderImage} alt='placeholder'/>
                </div>
                <div id='card-lower-content-container'>
                    <div id='card-lower-left-content-container' onClick={() => handleOpenGallery(index, true)}>
                        {directory.name}
                    </div>
                    <ProjectPage
                        trigger={ProjectPageBtnState}
                        setTrigger={(value) => handleOpenGallery(index, value)}
                        index={index}
                        name={directory.name}
                        author={directory.author}
                        description={directory.description}
                    />
                    <div id='card-lower-right-content-container'>
                        <button id='likeButton' onClick={() => handleLike(index)}>
                            <GalleryHeartIcon size={64} />
                        </button>
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
