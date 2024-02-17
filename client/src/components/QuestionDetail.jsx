import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import CommentForm from './CommentForm'
import CommentDetail from './CommentDetail'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import getTimeSincePosted from './getTimeSincePosted'
import '../style/CustomCards.css'

const socket = io('http://localhost:5000', {
  reconnection: true,
});

function QuestionDetail({ question }) {
  const [comments, setComments] = useState([])
  const [colorCode , setColorCode] = useState('')
  const { isLogin } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [newComment, setNewComment] = useState(null);
  useEffect(() => {
    const categoryColor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/ColorCategoryByName/${question.category}`);
        setColorCode(response.data);
      } catch (error) {
        console.error('Error fetch Category:', error);
      }
    };
    categoryColor();
  }, [question]);
  
  // useEffect(() => {
  //   console.log('comment123', commentsRef.current);
  // }, [commentsRef.current]);
  
  console.log("Check QUESTION : ",question.id)
  // useEffect(() => {
  //   setComments(question.comments);
  //   const handleNewComment = (newComment) => {
  //     if (newComment.question_id === question.id) {
  //       setComments((prevComments) => [...(prevComments || []), newComment]);
  //     }
  //   };

  //   socket.on('new-comment', handleNewComment);

  //   return () => {
  //     console.log('Component is unmounting');
  //     socket.off('new-comment', handleNewComment);
  //   };
  // }, [question.id]);
  useEffect(() => {
    setComments(question.comments);
    socket.on('new-comment', (comment) => {
      setNewComment(comment);
    });

    return () => {
      socket.off('new-comment');
    };
  }, []);

  useEffect(() => {
    if (newComment && newComment.question_id === question.id) {
      setComments((prevComments) => {
        const existingComments = prevComments || [];
        return [...existingComments , newComment];
      });
    }
  }, [newComment, question.id]);
  
  
  
  const timeSincePosted = getTimeSincePosted(question.created_at);

  return (
    <div>
        <Card key={question.id} className='custom-cards-container' >
          <div className='custom-cards-category' style={{backgroundColor:`${colorCode}`}}>{question.category}</div>
          <Card.Body>
              <Card.Text className='me-1' style={{fontSize:'15px', fontWeight:'500',display: 'inline'}}>
                คำถามจาก
              </Card.Text>
              <Card.Text style={{fontSize:'15px', fontWeight:'600',display: 'inline'}}>
                @{question.user_name} 
              </Card.Text>
              <Card.Text className='ms-3' style={{fontSize:'13px', display: 'inline'}}>
                {timeSincePosted}
              </Card.Text>
            <Card.Text className='mt-2' style={{fontSize:'18px'}}>{question.content}</Card.Text>
            
          </Card.Body>
        
        {comments && comments.length > 0  ?   
          <div>
            <div onClick={toggleDropdown} style={{ fontSize:'16px', color: '#065FD4' ,cursor: 'pointer', display: 'flex', alignItems: 'center' , marginBottom: '10px' }}>      
              <span className="custom-dropdown-icon ms-3 me-2" style={{ transform: `rotate(${isOpen ? '-180deg' : '0deg'})`, display: 'inline-block', transition: 'transform 0.3s ease' }}>▼</span>
              {comments.length} ความคิดเห็น
            </div>
            <div className="comments-section">
              <div className={`comment-list ${isOpen ? 'open' : ''}`}>
                {comments.map((comment, index) => (
                  <div key={index} className='mt-1'> 
                    <CommentDetail key={index} comment={comment} />   
                  </div>                  
                ))}
              </div>
            </div>
          </div>
          : <p className='ms-3' style={{fontSize:'16px' ,marginBottom: '10px' , color:'#737373'}}>ไม่มีความคิดเห็น...</p>
        }      
        {
          isLogin ? <CommentForm question={question} socket={socket} /> : null 
        }    
        </Card>
    </div>
  );
}
export default QuestionDetail;





  