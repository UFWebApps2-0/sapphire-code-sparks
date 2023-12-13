import React, { useEffect} from "react"
import { Modal, Form, Button, Input, Select } from "antd"
import { createModRecord } from "../../../../Utils/requests";
const { Option } = Select;

export default function ModerationAction({org}) {

    const [visible, setVisible] = React.useState(false); 
    
    const handleCancel = () => {
        setVisible(false); 
    }
    const showModal = () => {
        setVisible(true); 
    }
    const handleSubmit = async e => {
            const createModRecordResponse = await createModRecord("", "","",org,"")

        if (createModRecordResponse.err) {
            message.error("Failed to Create Moderation Record");
        }
        else {
            setVisible(false);
            props.load();
        }
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
        footer={null}
        width="50vw"
        >
                <Form
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                    onFinish={handleSubmit}
                    layout="horizontal"
                    size="default"
                >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "3vw"}}>
                <Select
                    placeholder="Select Action Type"
                    style={{ marginRight: 8}}
                >
                        <Option value = "create" >Create new...</Option>
                        <Option value = "create" >Create new...</Option>
                        <Option value = "modify">Modify existing...</Option>
                        <Option value = "delete">Delete...</Option>
                </Select>   

                <Select
                    placeholder="Select Action Target"
                    style={{ marginRight: 8 }}
                >
                        <Option value = "organization">Organization</Option>
                        <Option value = "school">School</Option>
                        <Option value = "classroom">Classroom</Option>
                        <Option value = "mentor">Mentor</Option>
                        <Option value = "student">Student</Option>
  
                </Select>   
                </div>
                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                        style={{ marginBottom: "0px" }}
                    >
                        <Button
                            onClick={handleCancel}
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="content-creator-button"
                        >
                            Submit
                        </Button>

                        <Button
                            onClick={handleCancel}
                            size="large"
                            className="content-creator-button"
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                    
                </Form>
        {/* <button onClick={() => alert('Delete something')}>
            Action 1
        </button> */}
        
      </Modal>
    </div>
  )
}

