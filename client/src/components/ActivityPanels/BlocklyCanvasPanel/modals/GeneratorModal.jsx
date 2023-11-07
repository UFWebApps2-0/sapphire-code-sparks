import { Modal, Button } from "antd"
import React, { useState } from "react"
import IconHammer from '../Icons/IconHammer';

export default function GeneratorModal(props) {
  const [hoverGenerator, setHoverGenerator] = useState(false);
  const [visible, setVisible] = useState(false);
  const { title, workspaceRef } = props;

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleGenerator = () => {
    return;
  }

  return (
    <div id='generator-modal'>           
      <IconHammer
          setHoverGenerator={setHoverGenerator}
          handleGenerator={handleGenerator}
          onMouseEnter={() => setHoverGenerator(true)}
          onMouseLeave={() => setHoverGenerator(false)}
      />
      {hoverGenerator && (
          <div className='popup ModalCompile3'>Generate Custom Block</div>
      )}
      
      <Modal
        title={title}
        visible={visible}
        onCancel={handleCancel}
        width='50vw'
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {workspaceRef ? (
          <p>hi</p>
        ) : null}
      </Modal>
    </div>
  );
}
