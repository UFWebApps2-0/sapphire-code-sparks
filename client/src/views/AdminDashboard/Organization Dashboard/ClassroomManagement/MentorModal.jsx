import { Modal, Button } from 'antd';
import React, { useState } from 'react';

export default function MentorModal({ linkBtn, mentor }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        View
      </button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div id='modal-student-card-header'>
          <h1 id='student-card-title'>{mentor.name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div id='description-container'>
            <br></br>
          </div>
          <div id='description-container'>
          </div>
        </div>
      </Modal>
    </div>
  );
}
