import React, { useEffect} from "react"
import { Modal, Select } from "antd"
const { Option } = Select;

export default function ModerationAction({org}) {

    const [visible, setVisible] = React.useState(false); 
    
    const handleCancel = () => {
        setVisible(false); 
    }
    const showModal = () => {
        setVisible(true); 
    }

      
    useEffect(() => { 
     
      const moderationRecords = org.moderation_records;

        
   
      
    }, [org])
    

  return (
    <div>
      <button onClick={showModal}>
        Moderation Action
      </button>
      <Modal
        title="New Moderation Action"
        visible={visible}
        onCancel={handleCancel}
        onOk={handleCancel}
        >
        <button onClick={() => alert('Delete something')}>
            Action 1
        </button>
        
      </Modal>
    </div>
  )
}

