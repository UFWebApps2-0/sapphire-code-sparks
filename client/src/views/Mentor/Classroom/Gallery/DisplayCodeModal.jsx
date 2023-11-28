import { Modal, Button } from 'antd';
import React, { useState, useRef } from "react";
import './Gallery.less'
import { uploadVideo } from '../../../../Utils/requests';
import { message } from 'antd';


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

    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: "",
    });
    const onSubmit = (e) => {
        e.preventDefault();
        // do something with the form data
        const { title, url, description } = formData;
        uploadVideo(title, url, description);
        setFormData({
            title: "",
            url: "",
            description: "",
        });
        message.success("Success!");
        //console.log("Good");
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

                ]}
            >

                <form onSubmit={onSubmit} >
                    <button
                        key="ok"
                        type="submit"
                        onClick={handleOk}
                        style={{
                            position: 'fixed',
                            bottom: 60,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        Upload
                    </button>

                    <input
                        type="text"
                        name="name"
                        value={formData.title}
                        onChange={(e) => {
                            console.log(formData); 
                            setFormData({ ...formData, title: e.target.value });
                        }}
                        placeholder="Title"
                        className='add-gallery-form-title'
                    />
                </form>
                &nbsp;

                <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    name="name"
                    placeholder="Video URL"
                    className='add-gallery-form-url'
                />
                &nbsp;
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    name="name"
                    placeholder="Description"
                    className='add-gallery-form-description'
                />  


            </Modal>

        </div>
    );
}
