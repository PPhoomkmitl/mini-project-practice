import React, { useState, useEffect } from 'react'
import Nav from '../components/NavBar'
import QuestionForm from '../components/QuestionForm'
import PaginationPage from '../components/PaginationPage'
import ReviewForm from '../components/ReviewForm'
import UploadFileForm from '../components/UploadFileForm'
import Banner from '../components/Banner'

import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client'

/*  MUI  */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../style/CustomTabs.css'

/* BootStrap */
import { Spinner } from 'react-bootstrap'

/* Client Socket */
const socket = io('http://localhost:5000', {
  reconnection: true,
});

export default function Home() {
  const { isLogin  , checkLoginStatus} = useAuth()
  const [questions, setQuestions] = useState([])
  const [reviews, setReviews] = useState([])
  const [uploadFiles, setUploadFiles] = useState([])
  const [loadingData, setLoadingData] = useState(false);
  

  /* Handle Tabs with value */  
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    socket.on('new-question', (newQuestion) => {
      setQuestions((prevQuestions) => [newQuestion, ...prevQuestions])
    })
    socket.on('new-review', (newReview) => {
      setReviews((prevReviews) => [newReview, ...prevReviews])
    })
    socket.on('new-uploadFile', (newUploadFile) => {
      setUploadFiles((prevUploadFiles) => [newUploadFile, ...prevUploadFiles])
    })

    return () => {
      socket.off('new-question')
      socket.off('new-review')
      socket.off('new-uploadFile')
    }   
  }, [])
 
  useEffect(() => {
    const reviewData = async () => {
      try {
          setLoadingData(true);
          const response = await axios.get('http://localhost:5000/review/all-reviews')
          if (response.data && response.data.length > 0) {
            setReviews(response.data)
            console.log('Fetch all Review Success')
          } else {
            console.log('No data received from the API.');
            setLoadingData(false);
          }
      } catch (error) {
          console.error('Error fetching reviews:', error);
          setLoadingData(false);
      } finally {
        setLoadingData(false); // สิ้นสุดการโหลดข้อมูล
      }
    }
    const uploadFileData = async () => {
      try {
          setLoadingData(true); 
          const response = await axios.get(`http://localhost:5000/upload/all-files`)
          console.log(' Upload ',response.data)
          if (response.data && response.data.length > 0) {
            setUploadFiles(response.data)
            console.log('Fetch all Upload Success')
            console.log('Upload Success',response.data)
          } else {
            console.log('No data received from the API.');
            setLoadingData(false);
          }
      } catch (error) {
          console.error('Error fetching upload:', error);
          setLoadingData(false);
      } finally {
        setLoadingData(false); // สิ้นสุดการโหลดข้อมูล
      }
    }
    checkLoginStatus()
    reviewData()
    uploadFileData()
  }, [])
  
  useEffect(() => {
    const questionData = async () => {
      try {
        setLoadingData(true); 
        const response = await axios.get('http://localhost:5000/question/all-questions');
        if (response.data && response.data.length > 0) {
          setQuestions(response.data);
          console.log('Fetch all Question Success');
          console.log('Form Home', response.data);
        } else {
          console.log('No data received from the API.');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoadingData(false); // สิ้นสุดการโหลดข้อมูล
      }
    }
  
    // กรณีที่ value เป็น "2" ให้รีเฟรชหน้าเว็บ
    if (value === '2') {
      questionData();
    }
  }, [value]);
  
  

  return (
    <div>
      <Nav/>
      <Banner/>
      <Box sx={{ width: '100%', typography: 'body1' , marginTop:'28px' , marginBottom:'35px'}}>
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label={<span style={{ fontSize: '18px' }}>รีวิว</span>} value="1" />
              <Tab label={<span style={{ fontSize: '18px' }}>คำถาม</span>} value="2" />
              <Tab label={<span style={{ fontSize: '18px' }}>สรุป</span>} value="3" />
            </TabList>

          </Box>
          <TabPanel value="1">
            {isLogin ? <ReviewForm socket={socket} count={reviews.length}/> : <hr className='line-lower-tab'/>}
            {loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg">
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) : reviews.length > 0 ? (
              <PaginationPage articles={reviews} type={'review'} />
            ) : (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                <SearchOffIcon fontSize="large" />
                <p>ไม่ค้นพบข้อมูลรีวิว</p>
              </div>
            )}
          </TabPanel>
          <TabPanel value="2" >           
            {isLogin ? <QuestionForm socket={socket} count={questions.length}/> : <hr className='line-lower-tab'/>}
            {loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg" >
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) :
            questions.length > 0 ? <PaginationPage articles={questions} type={"question"} /> 
              :
              <div style={{textAlign:'center',  marginBottom:'184px'}}>
                <SearchOffIcon fontSize="large"/>
                <p>ไม่ค้นพบข้อมูลคำถาม</p>
              </div>
            }  
          </TabPanel>
          <TabPanel value="3">
            {isLogin ? <UploadFileForm socket={socket} count={uploadFiles.length}/> : <hr className='line-lower-tab'/>}
            {loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg" >
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) :
            uploadFiles.length > 0 ?  <PaginationPage articles={uploadFiles} type={"uploadFile"} />
              :
              <div style={{textAlign:'center' , marginBottom:'180px'}}>               
                <SearchOffIcon fontSize="large"/>
                <p>ไม่ค้นพบข้อมูลไฟล์สรุป</p>
              </div>
            }
          </TabPanel>
        </TabContext>   
      </Box>      
    </div> 
  )
}

 

