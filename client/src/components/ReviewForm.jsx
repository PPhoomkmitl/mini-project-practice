import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {Form , Button , Modal , Spinner } from 'react-bootstrap'
import axios from 'axios'


function ReviewForm({ socket , defaultCategory , count}) {
    //BootStrap
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)

    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'กรุณาเลือกวิชา...')
    const { user, refreshTokens } = useAuth()
    const [loading, setLoading] = useState(false);

    /*<----------------Radio Score------------------->*/
    const [scores, setScores] = useState({
        group1: null,
        group2: null,
        group3: null
      })
    
      const aspects = [
        { label: 'จำนวนงานและการบ้าน', name: 'group1' },
        { label: 'ความน่าสนใจของเนื้อหา', name: 'group2' },
        { label: 'การสอนของอาจารย์', name: 'group3' }
      ];
    
      console.log("test1 default :" , defaultCategory)
      console.log("test2 select:" , selectedCategory)
      const handleScoreChange = (aspectName, value) => {
        setScores(prevScores => ({
          ...prevScores,
          [aspectName]: value
        }))
      }


      const handleSubmitScore = async (e) => {
        e.preventDefault();
        const newRating = {
            group1: scores.group1,
            group2: scores.group2,
            group3: scores.group3,
            date : new Date(),
            user : user.id ,
            category : selectedCategory 
        }

        console.log("NewRAting >>",newRating)
        const response =  await axios.post('http://localhost:5000/review/create-rating', newRating)
        console.log(response.data);
        console.log(scores)
        if(defaultCategory === null || defaultCategory === undefined){
            setSelectedCategory('กรุณาเลือกวิชา...')
        }
      }
    


    /*<-----------------Api get all category----------------->*/
    useEffect(() => {
        const categoryData = async() => {
        try {
            const response = await axios.get('http://localhost:5000/category/allCategory')
            setCategory(Array.isArray(response.data) ? response.data : []);
            console.log("Successful fetch Category", response.data.code);
        } catch (error) {
            console.error('Error fetch Category:', error);
        }
        }
        categoryData()
    },[])

    useEffect(() => {
        if (defaultCategory !== selectedCategory) {
            setSelectedCategory(defaultCategory || 'กรุณาเลือกวิชา...')
        }
    }, [defaultCategory])

    const handleClose = () => {
        setShow(false)
        setContent('')
        if(defaultCategory === null || defaultCategory === undefined){
            setSelectedCategory('กรุณาเลือกวิชา...')
        }
    }

    const handleCategorySelect = (e) => {
        const selectedCategory = e.target.value
        setSelectedCategory(selectedCategory)
    }


    /*<-----------------Submit Create new Review----------------->*/
    const handleSubmit = async (e) => {
        e.preventDefault()
        const itemToken = localStorage.getItem('access_token')
        // console.log(itemToken)
        setLoading(true);
        
        if (!content || !selectedCategory || selectedCategory === 'กรุณาเลือกวิชา...') {
            console.log('Content and category are required');
            return;
        }

        const newReview = {
            content :content,
            timeStamp: new Date(),
            user: user.id,
            category :selectedCategory,
        }
        console.log("Create Review",newReview)
        try {
            const response = await axios.post(
                'http://localhost:5000/review/create-review',
                newReview,
                {
                    headers: {
                        Authorization: `Bearer ${itemToken}`,
                    },
                }
            )
            console.log("test REview",response.data)
            if (socket) {   
                console.log('review Check',response.data[0])     
                socket.emit('review', response.data[0])
            }          
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await refreshTokens()
                const newAccessToken = localStorage.getItem('access_token')
                try {
                    const response = await axios.post(
                        'http://localhost:5000/review/create-review',
                        newReview,
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    )
                    socket.emit('review', response.data)     
                } catch (error) {
                    console.error('Error creating review:', error)
                }
            } else {
                console.error('Error creating review: 2', error)
            }
        }
        setContent('')
        if(defaultCategory === null || defaultCategory === undefined){
            setSelectedCategory('กรุณาเลือกวิชา...')
        }
        setShow(false)
    }

    return (
        <>
            <div style={{ margin: '0px auto', maxWidth: '850px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' , marginBottom:'40px' , marginTop:'30px'}}>
                    <p style={{ margin: 0 , fontSize:'18px',marginTop:'4px'}}>รีวิวทั้งหมด {count} รายการ</p>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{height: '1px', backgroundColor: 'black', width: '97%'}} />
                    </div>
                    <Button variant="dark" onClick={handleShow}>
                        สร้างรีวิว
                    </Button>
                </div>
            </div>      
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>สร้างรีวิว</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>เเสดงความคิดเห็น</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                placeholder="เขียนความคิดเห็น..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <Form.Select
                                aria-label="Default select example"
                                onChange={handleCategorySelect}
                                value={selectedCategory}
                            >
                               {defaultCategory === null || defaultCategory === undefined? (
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
                        </Form.Group>
                    </Form>
                    <Form>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">ไม่พอใจ</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col">พอใจ</th>
                            </tr>
                            <tr>
                                <th scope="col">ให้คะแนนความพอใจวิชา</th>
                                <th scope="col">1</th>
                                <th scope="col">2</th>
                                <th scope="col">3</th>
                                <th scope="col">4</th>
                                <th scope="col">5</th>
                            </tr>
                            </thead>
                            <tbody>
                            {aspects.map((aspect, index) => (
                                <tr key={index}>
                                <td>{aspect.label}</td>
                                {[1, 2, 3, 4, 5].map(value => (
                                    <td key={value}>
                                    <Form.Check
                                        inline
                                        label=""
                                        name={aspect.name}
                                        type={"radio"}
                                        id={`inline-radio-${value}-${aspect.name}`}
                                        className="ms-1"
                                        onChange={() => handleScoreChange(aspect.name, value)}
                                    />
                                    </td>
                                ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                </Form>
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
                        <Button variant="primary" type="submit"onClick={(e) => {handleSubmit(e); handleSubmitScore(e);}} >
                            สร้างรีวิว
                        </Button>
                        )
                    }
                </Modal.Footer>
            </Modal>                 
        </>
    )
}

export default ReviewForm