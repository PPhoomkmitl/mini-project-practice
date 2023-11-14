import axios from 'axios';
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'


/* MUI */
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
/* BootStrap */
import { Form , Button } from 'react-bootstrap';


import '../style/CustomLogin.css'

const AuthForm = ({ type , email}) => {
  const [formData, setFormData] = useState({ user_name:"", first_name: "", last_name : "", email: email || "" , password : "" , refreshToken :""})
  const { setIsLogin , setUser  , setIsRegister } = useAuth();
  const [validated, setValidated] = useState(true)
  const [passwordValid , setPasswordValid] = useState(true)

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      const response = await axios.post(`http://localhost:8080/auth/${type.toLowerCase()}`, formData );
      if(response !== null){
        const { user, accessToken, refreshToken } = response.data
        setUser(user)
        setValidated(true);

        if(type === 'login'){
          setIsLogin(true) 
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)
        }
        else if(type === 'register') {
          setIsRegister(true)        
        }      
      }
      else{
        console.error('have error');
        setValidated(false);
      }
      e.stopPropagation();
    } catch (error) {
      setValidated(false);
      console.error('Error:', error);
      
    }
  };
 

  return (
    <>
    {
      type === 'register'
    }
    <Form onSubmit={handleSubmit}>
      {type === 'register' && (
        <>
        <div className="container-login">
            <div className="left-column-login">
              <div className="left-column-login-detail"></div>             
            </div>
            <div className="right-column-login">
              <h2>ลงทะเบียน</h2>
              <p>หากต้องการลงทะเบียนกรุณาข้อมูลให้ครบถ้วน</p>
              <div className='form-login'>
                <Form.Group className="mb-3" controlId="formBasicFirstName">   
                  <Form.Label>ชื่อจริง</Form.Label>         
                  <Form.Control type="text" placeholder="กรุณาป้อนชื่อจริง" required onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} /> 
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLastName">   
                  <Form.Label>นามสกุล</Form.Label>            
                  <Form.Control type="text" placeholder="กรุณาป้อนนามสกุล" required onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} /> 
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUserName">            
                  <Form.Label>ชื่อผู้ใช้งาน</Form.Label>   
                  <Form.Control type="text" placeholder="กรุณาป้อนชื่อผู้ใช้งาน" required onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} /> 
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">   
                  <Form.Label>รหัสผ่าน</Form.Label>        
                  <Form.Control type="password" placeholder="รหัสผ่าน" required onChange={(e) => {
                      const password = e.target.value;
                      const regex = /^(?=.*[A-Za-z])([A-Za-z0-9]{6,})$/;

                      if (regex.test(password)) {
                        setFormData({ ...formData, password });
                        setPasswordValid(true)
                        // {
                        //   <Form.Text className="text-success">
                        //   <CheckCircleOutlineIcon/>รหัสครบ6ตัวอักษร
                        //   </Form.Text> 
                        // }
                      
                      } else {
                        setPasswordValid(false)
                        console.log('Fail')                       
                      }
                    }} />
                    {!passwordValid && (
                      <Form.Text className="text-warning">
                        <WarningAmberIcon fontSize="9px"/> รหัสควรจะมีอย่างน้อย 6 อักษรขึ้นไป
                      </Form.Text> 
                    )}                      
                </Form.Group>           
              </div>
              <Button type="submit" className='center-button '>
                ลงทะเบียน
              </Button>   
            </div>
          </div>
        </>
      )}
      {type === 'login' && (
        <>
        <div className='form-login'>                          
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {
                validated ? <Form.Label>อีเมล</Form.Label> : <Form.Label className='text-danger'>* อีเมลหรือรหัสผ่านไม่ถูกต้อง </Form.Label>
              }
              <Form.Control type="email" placeholder="กรุณาป้อนอีเมล@kmitl.ac.th" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              {
                validated ? <Form.Label>รหัสผ่าน</Form.Label> : <Form.Label className='text-danger'>* รหัสผ่าน</Form.Label>
              }             
              <Form.Control type="password" placeholder="รหัสผ่าน" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </Form.Group>            
        </div> 
        <Button  type="submit" className='center-button '>
          เข้าสู่ระบบ
        </Button>  
        </>       
      )} 
      {
        
      }
           
    </Form>
    </>
  );
};

export default AuthForm

 {/* <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              </Col>
            </Form.Group>
           </Form> */}

          {/* <input
            type="email"
            placeholder="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          /> */}