import { Button, Form, Input, message, Modal, Popconfirm } from "antd"
import "../../../ContentCreator/ActivityEditor/ActivityEditor.less"
import { QuestionCircleOutlined } from '@ant-design/icons';

{/*
    Possibilites:
        Change styling to a gray X in the corner?
        Set up props to better handle styling

    TODO:
        Do not return if link is null
        Delete when clicked
*/}

function DeleteVideoButton (embedLink) {
    if (embedLink.embedLink) {
        return (
            <Popconfirm
                title={`Are you sure you want to remove (TITLE) from this activity?`}
                okText='Delete'
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {}}
            >
            <button id="delete--video" onClick={() => {}}>
                X
            </button>    
            </Popconfirm>
        );
    }
}

export default DeleteVideoButton;