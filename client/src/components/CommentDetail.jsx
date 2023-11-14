import React from 'react';
import getTimeSincePosted from './getTimeSincePosted'

function CommentDetail({ comment }) {
  const timeSinceComment = getTimeSincePosted(comment.created_at);
  return (
    <div className='custome-detail-comment'>
      <p style={{display: 'inline' , fontWeight:'600',fontSize:'14px'}}>@{comment.user_name}</p>
      <p style={{display: 'inline' , marginLeft:'10px' , fontSize:'13px'}}>{timeSinceComment}</p>
      <p>{comment.content}</p>  
      <hr/>
    </div>
  );
}

export default CommentDetail;

