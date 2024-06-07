
import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useGlobalState } from '../../Utils/userState';
import { getCommentcs, postCommentcs,putCommentcs } from '../../Utils/requests';

const Comment = ({ saveId, comments, setComments }) => {
  const [currentUser] = useGlobalState('currUser');
  const [commentInput, setCommentInput] = useState('');
 
  const fetchComments = async () => {
    try {
        const response = await getCommentcs(saveId);
        if (response) {
            console.log(response.data);
            // 如果response.data.Sendermessage已经是对象，则不需要解析
            const commentsArray = response.data.Sendermessage;

            // 假设commentsArray是一个数组，我们可以继续
            if (Array.isArray(commentsArray)) {
                const sortedComments = commentsArray.sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
                setComments(sortedComments);
            } else {
                // 如果commentsArray不是数组，这里可以处理错误
                console.error('Expected an array of comments, but got:', commentsArray);
            }
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

  useEffect(() => {
    fetchComments();
  }, [saveId]);

  const submitComment = async () => {
    if (commentInput.trim()) {
      // Create a new comment object
      const newComment = {
        sendername: currentUser.name,
        message: commentInput,
        timestamp: new Date().toISOString()
      };
      
      try {
        // Append the new comment to the existing array
        const updatedComments = [...comments, newComment];
       
        // Send the updated array to the backend
        if((await getCommentcs(saveId))===null){
        
        await postCommentcs({
          saveId, // 这里是传递给postCommentcs的saveId
          comments: updatedComments // 这里是传递给postCommentcs的评论数组
        });}
        else{
          console.log(updatedComments);
          await putCommentcs(
            saveId, updatedComments
          )
        }
        
        // Update comments state
        setComments(updatedComments);
        setCommentInput(''); // Clear the input field
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
          
            <li key={index}><strong>{comment.sendername}: </strong>{comment.message}</li> 
             
           
        ))}
        </ul>
      </div>
    </div>
  );
};

export default Comment