import React from 'react';
import { Modal, Button } from 'antd';


const LessonModal = ({ isVisible, closeModal, lessonContent }) => {
    return (
      
      // Functional components to display a lesson 
      <Modal
        title="Lesson: "
        visible={isVisible}
        onClose={closeModal}
        className="lesson-modal"
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
      >
        {lessonContent}
      </Modal>
    );
  };

  export default LessonModal;