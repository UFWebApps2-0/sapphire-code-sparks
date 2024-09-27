import React, {useState} from 'react'
import { CopyOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import DemoData from '../../../DemoData.json';
import './ProjectPage.less'
import GalleryEdit from '../GalleryEdit/GalleryEdit';
import placeholderImage from "../../assets/placeholder-gallery-image1.jpg";
import {Divider} from "antd";

export default function ProjectPage(props) {
    const [projectStates, setProjectStates] = useState(
        DemoData.entries.map(() => ({
            GalleryEditBtn: false,
        }))
    );

    const {
        GalleryEditBtn: GalleryEditBtnState,
    } = projectStates[props.index];

    const handleCopyEdit = (index, value) => {
        setProjectStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[index] = { ...prevStates[index], GalleryEditBtn: value };
            return updatedStates;
        });
    };

    return (props.trigger) ? (
        <div id='popup'>
            <button className="exit-button" onClick={() => props.setTrigger(false)}>
                <CloseOutlined />
            </button>
            <div id='popup-inner'>
                <div id='popup-content'>
                    <div id='project-details'>
                        <div id='title'>{props.name}</div>
                        <div id='author'>By: {props.author}</div>
                        <div id='image-description-button'>
                            <img src={placeholderImage} alt='placeholder'/>
                            <div id='description-button'>
                                <div id='description'>
                                    {props.description}
                                </div>

                                <button id="copy-edit-button" onClick={() => handleCopyEdit(props.index, true)}>
                                    <CopyOutlined/>/
                                    <EditOutlined />
                                </button>

                                <GalleryEdit
                                    trigger={GalleryEditBtnState}
                                    setTrigger={(value) => handleCopyEdit(props.index, value)}
                                    name={props.name}
                                    author={props.author}
                                    description={props.description}
                                >
                                    <div id='edit-title'>Edit Mode</div>
                                </GalleryEdit>
                            </div>
                        </div>
                        <div id='discussion'>
                            <u>Discussion Board</u>
                            <div>
                                <div id='comment-box'>
                                    Discussion comments go here. . .
                                </div>
                                <form>
                                    <input
                                        className="searchBar"
                                        type="text"
                                        placeholder="Type to comment. . ."
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                    <div id='related-works'>
                        <div id='related-works-title'>
                            Related Works
                        </div>
                        <div id='related-works-content'>
                            related works go here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : "";
}