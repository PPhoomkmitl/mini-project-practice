import React , { useState , useEffect} from 'react'
import '../style/CustomBanner.css'
import ProgressBarScreen from '../components/ProgressBarScreen'
import axios from 'axios'

function Banner({id}) {
  const [colorCode , setColorCode] = useState('')

  //Api get all category
  useEffect(() => {
    const categoryColor = async() => {

      try {
        const response = await axios.get(`http://localhost:5000/category/ColorCategoryByName/${id}` )
        setColorCode(response.data)
      } catch (error) {
        console.warn('warning fetch Category:', error)
      }
    } 
    categoryColor()
  },[id])


 
  return (
    <>
        { id ?      
          <div className='custom-container-banner-1'>
            
              <div className='banner-1-selected'>
                  <p style={{fontSize:'2.75rem'}}>kmitl Inslight</p>
                  <p style={{fontSize:'1.8125rem'}}>แชร์ความรู้และประสบการณ์ในการเรียนรู้วิชาเสรี</p>
              </div>
              <div className='banner-2-selected'>
                    <div className='custom-cards-category-banner' style={{backgroundColor:`${colorCode}`}}><p>{id}</p></div>
                    <div className='custom-content-2-selected'>
                        <p style={{color:'white'}}>คะแนนภาพรวม</p>
                        <p style={{color:'white', marginRight:'65px'}}>ไม่พอใจ</p>
                        <p style={{color:'white'}}>พอใจ</p>                     
                    </div>  
                    <div className='custome-container-progressBar'>
                        {id ? <ProgressBarScreen id={id} /> : null}
                    </div>
              </div>
          </div>
          :
          <div>
            <div className='custom-container-banner-2'>
              <div className='custom-banner'>
                  <h1 style={{fontSize:'2.75rem'}}>Kmitl Inslight</h1>
                  <p style={{fontSize:'1.8125rem'}}>แชร์ความรู้และประสบการณ์ในการเรียนรู้วิชาเสรี</p>
              </div> 
            </div> 
          </div>
          
        }
    </>
  )
}

export default Banner




