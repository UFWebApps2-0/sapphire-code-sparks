import { useState } from 'react'
import { Form, Input } from 'antd'

function VideoURL_Input () {

  const [URL, setURL] = useState("");

  const checkEmbedLink = URL => {
    const regex = /<iframe.*?<\/iframe>/s;

    if (URL.search(regex) === -1) {
      return null;
    }
    return URL;
  }

  return (
    <div>
      <Form.Item id="form-label" label="Video embed link:">
        <Input.TextArea
          onChange={e => {
            setURL(e.target.value)
            console.log(checkEmbedLink(e.target.value))
          }}
          value={URL}
          className="input"
          placeholder="Enter video embed link"
        ></Input.TextArea>
      </Form.Item>
    </div>
  );
}

export default VideoURL_Input;

