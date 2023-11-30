import { useState } from 'react'
import { Form, Input } from 'antd'

function VideoURL_Input ( { setEmbedLink, embedLink } ) {

  const checkEmbedLink = embedLink => {

    const regex = /<iframe.*?<\/iframe>/s;

    if (embedLink.search(regex) === -1) {
      return null;
    }
    return embedLink;
  }

  return (
    <div>
      <Form.Item id="form-label" label="Video embed link:">
        <Input.TextArea
          onChange={e => {
            setEmbedLink(e.target.value);
            checkEmbedLink(e.target.value);
          }}
          value={embedLink}
          className="input"
          placeholder="Enter video embed link"
        ></Input.TextArea>
      </Form.Item>
    </div>
  );
}

export default VideoURL_Input;

