import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import getTimeSincePosted from './getTimeSincePosted'
import '../style/CustomCards.css'
;

function ReviewDetail({ review }) {
  const [colorCode , setColorCode] = useState('')
 
  useEffect(() => {
    const categoryColor = async() => {
      try {
        const response = await axios.get(`http://localhost:8080/category/ColorCategoryByName/${review.category}` )
        setColorCode(response.data)
      } catch (error) {
        console.error('Error fetch Category:', error)
      }
    }
    categoryColor()
  },[review])
 
  const timeSincePosted = getTimeSincePosted(review.created_at);
 
  return (
    <>
      <Card key={review.id} className='custom-cards-container'>
        <div className='custom-cards-category' style={{backgroundColor:`${colorCode}`}}>{review.category}</div>
        <Card.Body>
              <Card.Text className='me-1' style={{fontSize:'15px', fontWeight:'500',display: 'inline'}}>
                โดย 
              </Card.Text>
              <Card.Text style={{fontSize:'15px', fontWeight:'600',display: 'inline'}}>
                @{review.user_name} 
              </Card.Text>
              <Card.Text className='ms-3' style={{fontSize:'13px', display: 'inline'}}>
                {timeSincePosted}
              </Card.Text>
            <Card.Text className='mt-2' style={{fontSize:'18px'}}>{review.content}</Card.Text>        
          </Card.Body>
      </Card>
    </>
  );
}
export default ReviewDetail;
