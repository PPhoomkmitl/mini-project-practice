import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import AuthForm from './AuthForm' 

/* MUI */
import MenuBookIcon from '@mui/icons-material/MenuBook';

import '../style/CustomOtp.css'

const OtpForm = ({ type }) => {
  const [email , setEmail] = useState('')
  const [token, setToken] = useState('')
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [isOtpVerified ,setIsOtpVerified] = useState(false)
  const [isValidDate , setIsValidDate] = useState(true)
  const [textInValid , setTextInValid] = useState('')


  
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8080/auth/generateOTP`, { email });
      console.log('Status',response.status)
      console.log('data',response.data)
      console.log('data2',response.data.id)
      if (response.status === 200) {
        setIsEmailSubmitted(true)     
        setIsValidDate(true)
        localStorage.setItem('secret_token', response.data.id)
        setTimeout(function() {
          localStorage.removeItem('secret_token');
          console.log('Secret token has expired and been removed from localStorage.');
        }, 30 * 1000); // 30 seconds in milliseconds
        console.log(response.data.id)
        console.log(localStorage.getItem('secret_token'))
        console.log('Successful send OTP')
      } else {
        alert('email ไม่ถูกต้อง')
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Yess1")
        setIsValidDate(false)
        setTextInValid('ข้อมูลอีเมลไม่ถูกต้อง')
      }
      else if (error.response && error.response.status === 409) {
        console.log("Yess2")
        setIsValidDate(false)
        setTextInValid('อีเมลนี้ถูกใช้ไปเเล้ว')
        // alert('อีเมลนี้ถูกใช้ไปเเล้ว')
      }
      else {
        console.error('Error:', error)
      }
      
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    console.log('OTP to be verified:', token);
    const id = localStorage.getItem('secret_token')
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/verifyOTP`,
        { id , token},
      )
      console.log('VerifyOTP :',response.data)
      if (response.data.isValid) {
        setIsOtpVerified(true)
        setEmail(response.data.email)
        localStorage.removeItem('secret_token');
        console.log('Successful OTP')
        console.log(email)
      } else {
        setIsValidDate(false)
        setTextInValid('รหัส OTP ไม่ถูกต้อง')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className='custom-font'>
      { !isOtpVerified &&
        <div className="two-column-layout">
          <div className="left-column"></div>
          <div className="right-column">
            <div className="centered-content" style={{marginBottom:'5px'}}>
              <MenuBookIcon sx={{ fontSize:60}} style={{marginBottom:'20px'}}/>
              <h2>สมัครสมาชิก Kmitl Inslight</h2>
              <p>เพื่อเป็นส่วนหนึ่งแชร์ความรู้และประสบการณ์ในการเรียนรู้วิชาเสรี</p>
            </div>
            <div className="centered-content">
              <Form onSubmit={isEmailSubmitted ? handleOtpSubmit : handleEmailSubmit}>                                    
                  { isValidDate ? (
                      isEmailSubmitted ? "กรอกรหัส OTP" : "*กรุณาใช้อีเมลมหาลัยของคุณเท่านั้น "
                  ) : (
                      <p style={{marginBottom:'0px' ,fontSize:'16px',color:'#dc3545'}}>*{textInValid}</p>
                  )}
                  <Form.Group className="mb-3" controlId="formBasicInput">
                    <Form.Control 
                      type={isEmailSubmitted ? "text" : "email"}
                      placeholder={isEmailSubmitted ? "กรอกรหัส OTP" : "กรุณาป้อนอีเมล@kmitl.ac.th"} 
                      value={isEmailSubmitted ? token : email}
                      onChange={(e) => isEmailSubmitted ? setToken(e.target.value) : setEmail(e.target.value)} />
                  </Form.Group>
                  <div className="centered-content">
                    <Button  type="submit" style={{width:'200px'}}>
                      {isEmailSubmitted ? "ยืนยัน OTP" : "ยืนยันอีเมล"}              
                    </Button>
                  </div>                  
              </Form>     
            </div>
          </div>
        </div>
      }
      {isOtpVerified && <AuthForm type="register" email={email}/>}
    </div>
  )
}

export default OtpForm



