import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal ,Alert , Spinner} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function UploadFileForm({ socket , defaultCategory , count}) {
  const { user, refreshTokens } = useAuth()
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'กรุณาเลือกวิชา...')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false);


  /*<-----------------Api get all category----------------->*/
  useEffect(() => {
    const categoryData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category/allCategory');
        setCategory(Array.isArray(response.data) ? response.data : []);
        console.log("Successful fetch Category", response.data.code);
      } catch (error) {
        console.error('Error fetch Category:', error);
      }
    }
    categoryData()
  }, []);

  const handleClose = () => {
    setShow(false);
    if (defaultCategory === null || defaultCategory === undefined) {
      setSelectedCategory('กรุณาเลือกวิชา...');
    }
  }

  const handleCategorySelect = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
  }

  useEffect(() => {
    if (defaultCategory !== selectedCategory) {
      setSelectedCategory(defaultCategory || 'กรุณาเลือกวิชา...');
    }
  }, [defaultCategory]);

  /*<-----------------Handle File----------------->*/
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('Selected File:', selectedFile);
      setSelectedFile(selectedFile);
    } else {
      console.error('No file selected');
    }
  }

  const handleUpload = async () => {
    try {
      const itemToken = localStorage.getItem('access_token')
      const formData = new FormData();
      setLoading(true);
      
      if(selectedFile !== null && selectedCategory !== 'กรุณาเลือกวิชา...'){
        formData.append('pdfFile', selectedFile)
        formData.append('category', selectedCategory)
        formData.append('user', user.id)
      
       // Log FormData contents for debugging

      // console.log('FormData:', formData);
      const response = await axios.post('http://localhost:8080/upload/uploadFile', formData, {
      headers: {
        Authorization: `Bearer ${itemToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });  

      if (socket) {
        socket.emit('uploadFile', response.data)
        console.log('socket success')
      } 

     }else {
        console.log('File and Category are required')
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await refreshTokens()
        const newAccessToken = localStorage.getItem('access_token')
        const formData = new FormData(); 
        formData.append('pdfFile', selectedFile)
        formData.append('category', selectedCategory)
        formData.append('user', user.id)
        try {
          const response = await axios.post('http://localhost:8080/upload/uploadFile', formData, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (socket) {
            socket.emit('uploadFile', response.data)
          }                
        } catch (error) {
            console.error('Error uploading file:', error)
        }
        finally {
          setLoading(false); // สิ้นสุดตรวจสอบสถานะโหลด
        }
      } else {
        console.error('Error uploading file:', error)
      }
    }
    if (defaultCategory === null || defaultCategory === undefined) {
      setSelectedCategory('กรุณาเลือกวิชา...');
    }
    setShow(false);
  }

  return (
    <div>
      <div style={{ margin: '0px auto', maxWidth: '850px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between' , marginBottom:'40px' , marginTop:'30px'}}>
          <p style={{ margin: 0 , fontSize:'18px',marginTop:'4px'}}>สรุปทั้งหมด {count} รายการ</p>
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{height: '1px', backgroundColor: 'black', width: '97%'}} />
          </div>
          <Button variant="dark" onClick={handleShow}>
            อัพไฟล์สรุป
          </Button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>อัปโหลดไฟล์สรุป</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert key={'warning'} variant={'warning'}>
            **กรุณาเลือกไฟล์ที่เป็น pdf เท่านั้น
          </Alert>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <Form.Select
            aria-label="Default select example"
            onChange={handleCategorySelect}
            value={selectedCategory}
          >
            {defaultCategory === null || defaultCategory === undefined ? (
              <>
                <option disabled>กรุณาเลือกวิชา...</option>
                {category && category.map(Element => (
                  <option key={Element.id} value={Element.name}>{Element.name}</option>
                ))}
              </>
            ) : (
              <option value={defaultCategory}>{defaultCategory}</option>
            )}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
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
                กำลังโหลด...
              </Button>                   
                    ) 
                    : 
              (
                <Button variant="primary" type="submit" onClick={handleUpload}>
                  สร้างรีวิว
                </Button>
              )
            }
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UploadFileForm
