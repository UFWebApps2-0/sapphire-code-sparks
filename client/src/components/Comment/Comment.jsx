import React, { useState,useEffect } from 'react';
import { Input, Button } from 'antd';
import { useGlobalState } from '../../Utils/userState'; // 确保路径正确
import { getCommentcs, postCommentcs } from '../../Utils/requests';
const Comment = ({ saveId,comments, setComments }) => {
  
  const [currentUser] = useGlobalState('currUser'); // 获取当前用户信息
 console.log(saveId);
  const [commentInput, setCommentInput] = useState('');
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentcs(saveId);
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [saveId]);
  const submitComment = async () => {
    if (commentInput.trim()) {
      const newComment = {
        sendername: currentUser.name, // 使用当前用户的用户名
        sendermessage: commentInput,
        tablename: saveId, // 使用saveId作为tablename
        timestamp: new Date().toISOString()
      };
      
      try {
        const response = await postCommentcs(newComment);
        if (response.data) {
          setComments([...comments, response.data]);
          setCommentInput('');
        }
      } catch (error) {
        console.error('Error submitting new comment:', error);
      }
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
            <li key={index}><strong>{comment.sendername}: </strong>{comment.sendermessage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment;
