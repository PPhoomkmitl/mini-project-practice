import React from 'react';
import '../style/CustomFooter.css'
import CallIcon from '@mui/icons-material/Call';
const Footer = () => {
  return (
    <div className="row">
      <div className="col text-left">
        <p>kmitl Inslight<br/>@kmitl Inslight2024</p>
      </div>
      <div className="col text-mid">
        <p><CallIcon/>ติดต่อเราได้ที่<br/> 64050191@kmitl.ac.th</p>
      </div>
      <div className="col text-right">
        <p>เว็บไซต์นี้เป็นส่วนหนึ่ง<br/>ในวิชา Practical Project เท่านั้น</p>
      </div>
    </div>
  );
};

export default Footer;