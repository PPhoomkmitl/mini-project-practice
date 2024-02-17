import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../components/NavBar'
import QuestionForm from '../components/QuestionForm'
// import ProgressBarScreen from '../components/ProgressBarScreen'
import PaginationPage from '../components/PaginationPage'
import Banner from '../components/Banner'
import UploadFileForm from '../components/UploadFileForm'
import ReviewForm from '../components/ReviewForm'
import axios from 'axios'


/*  MUI  */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import '../style/CustomTabs.css'

/* Bootstrap */
import { Spinner } from 'react-bootstrap'

import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client';


const socket = io('http://localhost:5000', {
  reconnection: true,
});

export default function CategoryPage() {

  let { id } = useParams();
  const { isLogin  , checkLoginStatus} = useAuth()
  const [questions, setQuestions] = useState([])
  const [reviews, setReviews] = useState([])
  const [loadingData, setLoadingData] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([])
  
  /* Handle Tabs value */  
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  console.log(id)
  //Filter Question , Review , File  by category
  const filteredQuestions = questions.filter(question => question.category === id)
  const filteredReviews = reviews.filter(review => review.category === id)
  const filtereduploadFiles = uploadFiles.filter(uploadFile => uploadFile.category === id)

  useEffect(() => {
    socket.on('new-question', (newQuestion) => {
      setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
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

  //Api get all category
  useEffect(() => {
    //Axios review
    const reviewData = async () => {
      try {
        setLoadingData(true); // เริ่มต้นการโหลดข้อมูล
        const response = await axios.get('http://localhost:5000/review/all-reviews')
        if (response.data && response.data.length > 0) {
          setReviews(response.data)
          console.log('Fetch all Review Success')
          console.log(response.data)
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
    };
    //Axios yploadFile
    const uploadFileData = async () => {
      try {
        setLoadingData(true); // เริ่มต้นการโหลดข้อมูล
        const response = await axios.get(`http://localhost:5000/upload/all-files`)
        if (response.data && response.data.length > 0) {
          setUploadFiles(response.data)
          console.log('Fetch all Upload Success')
          console.log(response.data)
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
        setLoadingData(true); // เริ่มต้นการโหลดข้อมูล
        const response = await axios.get('http://localhost:5000/question/all-questions');
        if (response.data && response.data.length > 0) {
          setQuestions(response.data);
          console.log('Fetch all Question Success');
          console.log('Form Home', response.data);
        } else {
          console.log('No data received from the API.');
          setLoadingData(false);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoadingData(false);
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
    <>
      <Nav/>
      <Banner id = {id}/>
        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label={<span style={{ fontSize: '20px' }}>รีวิว</span>} value="1" />
              <Tab label={<span style={{ fontSize: '20px' }}>คำถาม</span>} value="2" />      
              <Tab label={<span style={{ fontSize: '20px' }}>สรุป</span>} value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            { isLogin ? <ReviewForm socket = {socket} defaultCategory = {id} count={filteredReviews.length}/> : <hr className='line-lower-tab'/> }
            { loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg" >
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) :
              filteredReviews.length > 0 ? (
                <PaginationPage articles={filteredReviews} type={"review"}/>
              ) : (
                <div style={{textAlign:'center'}}>
                  <SearchOffIcon fontSize="large"/>
                  <p>ไม่ค้นพบข้อมูลรีวิว</p>
                </div>              
              )
            }
          </TabPanel>
          <TabPanel value="2">
            { isLogin ? <QuestionForm socket = {socket} defaultCategory = {id} count ={filteredQuestions.length}/> : <hr className='line-lower-tab'/> }
            { loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg" >
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) :
              filteredQuestions.length > 0 ? (
                <PaginationPage articles={filteredQuestions} type={"question"}/>
              ) : (
                <div style={{textAlign:'center'}}>
                  <SearchOffIcon fontSize="large"/>
                  <p>ไม่ค้นพบข้อมูลคำถาม</p>
                </div>
              )
            }
          </TabPanel>
          <TabPanel value="3">
          { isLogin ? <UploadFileForm socket = {socket} defaultCategory = {id} count={filtereduploadFiles.length}/> : <hr className='line-lower-tab'/> }
          { loadingData ? (
              <div style={{ textAlign: 'center', marginBottom: '197px' }}>
                 <Spinner animation="border" role="status" size="lg" >
                    <span className="visually-hidden">Loading...</span>
                 </Spinner>
              </div>
            ) :
              filtereduploadFiles.length > 0 ? (
                <PaginationPage articles={filtereduploadFiles} type={"uploadFile"}/>
            ) : (
              <div style={{textAlign:'center' }}>
                <SearchOffIcon fontSize="large"/>
                <p>ไม่ค้นพบข้อมูลสรุป</p>
              </div>           
            )
          }
          </TabPanel>
        </TabContext>
      </Box>     
    </>
  )
}