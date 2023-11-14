import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../style/CustomNavbar.css'

/* MUI */
import MenuBookIcon from '@mui/icons-material/MenuBook';

function navbar() {
  let navigate = useNavigate();

  const { isLogin, setIsLogin, setUser , user } = useAuth();
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('กรุณาเลือกวิชา...');
  // const [isLoading, setIsLoading] = useState(false);

  //Api get all category
  useEffect(() => {
    const categoryData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category/allCategory');
        setCategory(Array.isArray(response.data) ? response.data : []);
        // console.log("Successful fetch Category", response.data.code);
      } catch (error) {
        console.error('Error fetch Category:', error);
      }
    };
    categoryData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsLogin(false);
  };

  const handleCategorySelect = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    navigate(`/Category/${encodeURIComponent(selectedCategory)}`);
  };

  console.log(isLogin)
  return (
  <div>
      <Navbar bg='white' variant='dark' className='Navbr-container'  >
      <Container>     
        <Navbar.Brand href="/" style={{ color: 'black' }}>{<MenuBookIcon sx={{ fontSize:25}} style={{marginBottom:'5px'}}/>} Kmitl Inslight</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Form.Select
              aria-label="Default select example"
              onChange={handleCategorySelect}
              value={selectedCategory}
              className='custom-select-option'  
              style={{fontSize:'1rem'}}                
            >
              <option disabled>กรุณาเลือกวิชา...</option>
              {category &&
                category.map((Element) => (
                  <option key={Element.id} value={Element.name}>
                    {Element.name}
                  </option>
                ))}
            </Form.Select>
          </Nav>

          {isLogin ? (
            null
          ) : <Button className='ms-2 Navbar-button-1' href="/LogIn">เข้าสู่ระบบ</Button>}
          {isLogin ? (
            <>
              <p style={{marginTop:'15px',marginRight:'10px'}}>ยินดีต้อนรับ {user.user_name}</p>
              <Button className="ms-2 Navbar-button-2" onClick={handleLogout}>ออกจากระบบ</Button>
            </>
           
          ) : (
              <Button className='ms-2 Navbar-button-2' href="/Register">ลงทะเบียน</Button>    
          )} 
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  </div>
  );
}

export default navbar;
