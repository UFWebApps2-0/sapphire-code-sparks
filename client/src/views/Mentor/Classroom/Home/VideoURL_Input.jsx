import { useState } from 'react'
import { Form, Input } from 'antd'

function VideoURL_Input () {

  const [URL, setURL] = useState("");

  return (
    <div>
      <Form.Item id="form-label" label="Video embed link:">
        <Input.TextArea
          onChange={e => setURL(e.target.value)}
          value={URL}
          className="input"
          placeholder="Enter video embed link"
        ></Input.TextArea>
      </Form.Item>
    </div>
  );
}

export default VideoURL_Input;

