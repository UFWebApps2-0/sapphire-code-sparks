import { Button, Form, Input, message, Modal, Popconfirm } from "antd"
import "../../../ContentCreator/ActivityEditor/ActivityEditor.less"
import { QuestionCircleOutlined } from '@ant-design/icons';

function DeleteVideoButton ({ embedLink, setEmbedLink}) {
    async function DeleteVideoQuery() {

        // const response = await deleteVideoLinkURL(embedLink)
        // if (response.data[0]) {
        //     console.log("URL: " + response.data[0].URL);
        //     setEmbedLink("");
        // }
        // else if (!response[0]) {
        //     message.error("Failed to delete. Does this video exist?")
        // }
        // else if (response.err) {
        //     message.error(response.err)
        // }

        setEmbedLink("");

    }

    
    
    if (embedLink) {
        return (
            <Popconfirm
                title={`Are you sure you want to remove "${embedLink}" from this activity?`}
                okText='Delete'
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={DeleteVideoQuery}
            >
            <button id="delete--video">
                X
            </button>    
            </Popconfirm>
        );
    }
}


export default DeleteVideoButton;