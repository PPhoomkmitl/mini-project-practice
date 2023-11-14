import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import '../style/CustomComment.css'

/* BootStrap */
import { Form , Spinner , Button } from 'react-bootstrap';
/* MUI Component*/
import SendIcon from '@mui/icons-material/Send';


function CommentForm({ question, socket }) {
  const [content, setContent] = useState('');
  const { user, refreshTokens } = useAuth();
  const [loading, setLoading] = useState(false);

  const itemToken = localStorage.getItem('access_token');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if(content !== null && content !== undefined && content !== ''){
      // console.log('yes Questionnn', question.id)
      // const timeStamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
      console.log("question",question)
      console.log("questionID",question.id)
      const newComment = {
        content: content,
        userId: user.id,
        user_name: user.user_name,
        questionID: question.id
      }
    
      try {
        const response = await axios.post(
          `http://localhost:8080/question/createComment/${question.id}`,
          newComment,
          {
            headers: {
              Authorization: `Bearer ${itemToken}`,
            },
          }
        );
        console.log("RESPONSE Comment",response.data);
        setContent(''); 
        /* Emit the new comment to the server */
        socket.emit('comment', response.data );
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await refreshTokens();
          const newAccessToken = localStorage.getItem('access_token');
          try {
            const response = await axios.put(
              `http://localhost:8080/question/createComment/${question.id}`,
              newComment,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );
            console.log(response.data);
            setContent('');
            socket.emit('comment', newComment);
          } catch (error) {
            console.error('Error creating comment:', error);
          }
          finally {
            setLoading(false); // สิ้นสุดตรวจสอบสถานะโหลด
          }
        } else {
          console.error('Error creating comment: ', error);
        }
        setLoading(false);
      }
    }
    else {
      console.log('content is required')
    }
    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="mx-2 d-inline-flex mb-4 mt-1">
        <input
          type="text"
          placeholder="เพิ่มความคิดเห็น..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="custom-comment-input"
        />

        {loading ?
          (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />             
              </Button>                   
          ) 
          : 
          (
            <button
              type="submit"
              className="custom-submit-button"
            >
              <SendIcon/>
            </button>
          )
        }
        
      </Form>
    </>
  );
}

export default CommentForm;

