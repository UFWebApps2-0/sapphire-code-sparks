import React, { useState } from 'react';
import { Input, Button } from 'antd';

const Comment = ({ comments, setComments }) => {
  const [commentInput, setCommentInput] = useState('');

  const submitComment = () => {
    if (commentInput.trim()) {
      setComments([...comments, commentInput]);
      setCommentInput('');
    }
  };

  return (
    <div>
      <div className='comment-section'>
        <Input.TextArea
          rows={4}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Enter your comment here..."
        />
        <Button type="primary" onClick={submitComment} disabled={!commentInput.trim()}>
          Submit Comment
        </Button>
      </div>
      <div className='comments-display'>
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment;
