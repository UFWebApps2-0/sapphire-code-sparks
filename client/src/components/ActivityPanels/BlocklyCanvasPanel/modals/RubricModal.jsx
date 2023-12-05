import { Modal, Button, Typography, Menu } from 'antd';
import React, { useState } from 'react';

export default function RubricModal(rubric) {
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
    <div id='code-modal'>
    <Menu.Item onClick={showModal}>Show Rubric</Menu.Item>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          width='50vw'
          footer={[
              <Button key='ok' type='primary' onClick={handleOk}>
                  OK
              </Button>,
          ]}>
          <div id = "display-rubric">
            <table>
                <tr>
                    <th class = "display-rubric-header">Criteria</th>
                    <th class = "display-rubric-header" colspan = "3">Description & Points</th>
                </tr>
                <tr>
                    <td class = "display-rubric-criteria">Compilation </td>
                    <td class = "display-ratings"><div id = "display-ratings-points">3 points</div>Code compiles and is correct</td>
                    <td class = "display-ratings"><div id = "display-ratings-points">2 points</div>Code compiles</td>
                    <td class = "display-last"><div id = "display-ratings-points">1 points</div>Code does not compile</td>
                </tr>
                <tr>
                    <td class = "display-rubric-criteria">Comments </td>
                    <td class = "display-ratings"><div id = "display-ratings-points">3 points</div>Sufficient comments</td>
                    <td class = "display-ratings"><div id = "display-ratings-points">2 points</div>Unsufficient comments</td>
                    <td class = "display-last"><div id = "display-ratings-points">1 point</div>No comments</td>
                </tr>
            </table>
         </div>
      </Modal>
    </div>
  )
  }