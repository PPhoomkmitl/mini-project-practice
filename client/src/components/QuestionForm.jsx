import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {Form , Button , Modal , Spinner } from 'react-bootstrap'
import axios from 'axios'

function QuestionForm({ socket , defaultCategory , count }) {
    //BootStrap
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)

    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'กรุณาเลือกวิชา...')
    const [loading, setLoading] = useState(false);
    const { user, refreshTokens } = useAuth()

    useEffect(() => {
        const categoryData = async() => {
            try {
                const response = await axios.get('http://localhost:8080/category/allCategory')
                setCategory(Array.isArray(response.data) ? response.data : []);
                console.log("Successful fetch Category", response.data);
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

    // console.log("test1 default :" , defaultCategory)
    // console.log("test2 select:" , selectedCategory)
    const handleClose = () => {
        setShow(false)
        setContent('')
        if(defaultCategory === null || defaultCategory === undefined){
            setSelectedCategory('กรุณาเลือกวิชา...')
        }
    }

    const handleCategorySelect = (e) => {
        e.preventDefault()
        const selectedCategory = defaultCategory !== null && defaultCategory !== undefined ? defaultCategory : e.target.value;
        setSelectedCategory(selectedCategory);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const itemToken = localStorage.getItem('access_token')
        setLoading(true); 
        // if (selectedCategory == 'กรุณาเลือกวิชา...' || !content || selectedCategory == undefined) {
        //     console.log('Content and category are required');
        // }
        if(selectedCategory !== 'กรุณาเลือกวิชา...') {
        console.log(selectedCategory)
        const newQuestion = {
            contentResult: content,
            categoryResult: selectedCategory,
        }
        console.log(newQuestion)
            try {
                const response = await axios.post(
                    'http://localhost:8080/question/create-question',
                    newQuestion,
                    {
                        headers: {
                            Authorization: `Bearer ${itemToken}`,
                        },
                    }
                )
                if (socket) {
                    console.log('emit question',response.data)
                    socket.emit('question', response.data)
                }          
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    await refreshTokens()
                    const newAccessToken = localStorage.getItem('access_token')
                    try {
                        const response = await axios.post(
                            'http://localhost:8080/question/create-question',
                            newQuestion,
                            {
                                headers: {
                                    Authorization: `Bearer ${newAccessToken}`,
                                },
                            }
                        )
                        socket.emit('question', response.data[0])     
                    } catch (error) {
                        console.error('Error creating question:', error)
                    }
                } else {
                    console.error('Error creating question: 2', error)
                }
            }
            finally {
                setLoading(false); // สิ้นสุดตรวจสอบสถานะโหลด
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
                    <p style={{ margin: 0 , fontSize:'18px',marginTop:'4px'}}>คำถามทั้งหมด {count} รายการ</p>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{height: '1px', backgroundColor: 'black', width: '97%'}} />
                    </div>
                    <Button variant="dark" onClick={handleShow}>
                        สร้างคำถาม
                    </Button>
                </div>
            </div>
           

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>สร้างคำถาม</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>เเสดงคำถาม</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                placeholder="เขียนคำถาม..."
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
                            Loading...
                        </Button>                   
                    ) 
                    : 
                    (
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                        สร้างคำถาม
                        </Button>
                    )
                    }
                </Modal.Footer>      
            </Modal>
        </>
    )
}

export default QuestionForm

