import Reaact from 'react';
import { Modal } from 'antd';

const LessonModal = ({ isVisible, closeModal, description }) => {
    return (
      <Modal
        title="Lesson: "
        isVisible={isVisible}
        onClose={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
      >
      </Modal>
    );
  };

  export default LessonModal;