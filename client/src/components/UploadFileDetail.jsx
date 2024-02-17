import React, { useState, useEffect } from 'react'
import { Card , Button } from 'react-bootstrap';
import getTimeSincePosted from './getTimeSincePosted'
import axios from 'axios';
import '../style/CustomButtonDowload.css'


const UploadFileDetail = ({uploadFile}) => {
  const [colorCode , setColorCode] = useState('')


  useEffect(() => {
    const categoryColor = async() => {
      try {
        const response = await axios.get(`http://localhost:5000/category/ColorCategoryByName/${uploadFile.category}` )
        setColorCode(response.data)
      } catch (error) {
        console.error('Error fetch Category:', error)
      }
    }
    categoryColor()
  },[uploadFile])



  const timeSincePosted = getTimeSincePosted(uploadFile.timeStamp);
  // const base64String = uploadFile.file_data.toString('base64');

  const handleDownload = async () => {
    try {
      // const filename = encodeURIComponent(uploadFile.file_name);
      // console.log("filename >> ",filename)
      const filename = encodeURIComponent(uploadFile.file_name);
      const response = await axios.get(`http://localhost:5000/upload/downloadFile/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
      });
      console.log(response.data)
      if (response.status === 200) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response.data]));
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = 'ไฟล์สรุป.pdf';
  
        document.body.appendChild(link);
        link.click();
  
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      } else {
        console.error('Failed to download file. Unexpected status:', response.status);
        alert('Failed to download file. Please try again later.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again later.');
    }
  };
  
  return (
    <>        

          <Card key={uploadFile.file_id} className='mb-5 mt-3 custom-cards-container'>
          <div className='custom-cards-category' style={{backgroundColor:`${colorCode}`}}>
            {uploadFile.category}
          </div>   
          <Card.Body>
                <div style={{ display:'flex' , justifyContent: 'space-between'}} >
                  <div>        
                    <Card.Text className='me-1' style={{fontSize:'21px', fontWeight:'500',display: 'inline'}}>
                      สรุปของ 
                    </Card.Text>  
                    <Card.Text className='me-1' style={{fontSize:'20px', fontWeight:'600',display: 'inline'}}>
                      @{uploadFile.user_name} 
                    </Card.Text>          
                    <Card.Text style={{fontSize:'16px' }}>
                      อัปโหลดเมื่อ {timeSincePosted}
                    </Card.Text>
                  </div>
                  <div>                    
                  <Card.Text>  
                    <Button className="download-button" onClick={handleDownload}>
                      ดาวน์โหลด
                    </Button>              
                  </Card.Text>  
                  </div>                   
                </div> 
            </Card.Body>
        </Card> 
    </>
  );
};

export default UploadFileDetail






