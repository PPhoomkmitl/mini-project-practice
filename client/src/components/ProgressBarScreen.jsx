import axios from 'axios';
import React ,{useState , useEffect} from 'react';
import '../style/CustomProgressbar.css'


function ProgressBarScreen({ id }) {
    const [rating , setRating] = useState([])
    console.log(id)
    useEffect(() => {
        const ratingData = async () => {
          try {
              const response = await axios.get(`http://localhost:5000/review/get-rating/${id}`)
              setRating(response.data)
              console.log('Fetch all Rating Success')
              console.log(response.data)
          } catch (error) {
              console.error('Error fetching rating:', error);
          }
        };
        ratingData()
        console.log('Success')
    }, [id])

    const calculatePercentage = (score) => (score / 5) * 100;

    const group1Percentage = rating && rating.averageRating && rating.averageRating.group1 
        ? calculatePercentage(rating.averageRating.group1) 
        : 0;

    const group2Percentage = rating && rating.averageRating && rating.averageRating.group2 
        ? calculatePercentage(rating.averageRating.group2) 
        : 0;

    const group3Percentage = rating && rating.averageRating && rating.averageRating.group3 
        ? calculatePercentage(rating.averageRating.group3) 
        : 0;

    return (
        <div style={{margin:'auto' , color:'white'}}>
            <div className='container-progressBar'>
                <p>จำนวนงานและการบ้าน</p>
                <div className="progress">
                    <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${group1Percentage}%`, background: 'linear-gradient(to right, rgba(255, 204, 128, 1), rgba(143, 43, 12, 1))' }}
                        aria-valuenow={group1Percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        {`${group1Percentage.toFixed(2)}%`}
                    </div>
                </div>
            </div>
            <div className='container-progressBar'>
                <p>ความน่าสนใจของเนื้อหา</p>
                <div className="progress">
                    <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${group2Percentage}%`, background: 'linear-gradient(to right, rgba(215, 73, 73, 1), rgba(115, 170, 236, 1))' }}
                        aria-valuenow={group2Percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        {`${group2Percentage.toFixed(2)}%`}
                    </div>
                </div>
            </div>
            <div className='container-progressBar'>
                <p>การสอนของอาจารย์</p>
                <div className="progress">
                    <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${group3Percentage}%`, background: 'linear-gradient(to right, rgba(84, 240, 90, 1), rgba(5, 25, 48, 1))' }}
                        aria-valuenow={group3Percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        {`${group3Percentage.toFixed(2)}%`}
                    </div>
                </div>
            </div>
        </div>         
    );
}

export default ProgressBarScreen;


