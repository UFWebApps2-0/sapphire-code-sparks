import { Modal, Button } from 'antd';
import React, { useState, useRef } from "react";
import './Gallery.less'


export default function DisplayCodeModal(props) {
    const [visible, setVisible] = useState(false);
    const { code } = props;
    const inputFile = useRef(null)
    

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };

    const onButtonClick = () => {
        
        inputFile.current.click();
    };

    return (
        <div id='display-code-modal'>
            <button id='display-code-btn' onClick={showModal}>Upload a Video</button>
            <Modal
                title={'Upload Video'}
                visible={visible}
                onCancel={handleCancel}
                width='90vw'

                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        Upload
                    </Button>,
                ]}
            >
                <form>
                    <input
                        type="text"
                        value={name}
                        onChange={e => {
                            setName(e.target.value)
                        }}
                        id="name"
                        name="name"
                        placeholder="Title"
                        className='add-gallery-form-title'
                    />
                </form>
                &nbsp;

                <input
                    type="text"
                    value={name}
                    onChange={e => {
                        setName(e.target.value)
                    }}
                    id="name"
                    name="name"
                    placeholder="Video URL"
                    className='add-gallery-form-url'
                />
                &nbsp;
                <input
                    type="text"
                    value={name}
                    onChange={e => {
                        setName(e.target.value)
                    }}
                    id="name"
                    name="name"
                    placeholder="Description"
                    className='add-gallery-form-description'
                />
                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} />
                <button className = 'upload-file-button' onClick={onButtonClick}>Upload Video File</button>


            </Modal>

        </div>
    );
}
