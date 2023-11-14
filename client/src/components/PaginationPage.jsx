import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Pagination from 'react-bootstrap/Pagination'
import QuestionDetail from './QuestionDetail'
import ReviewDetail from './ReviewDetail'
import UploadFileDetail from './UploadFileDetail'
import { v4 as uuidv4 } from 'uuid';


function PaginationPage({articles , type }) { 
  let { id } = useParams()

    // กำหนดจำนวนบทความต่อหน้า
  const articlesPerPage = 5;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  console.log(totalPages)

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;

  // สร้างรายการบทความที่จะแสดงในหน้าปัจจุบัน
  const displayedArticles = articles.slice(startIndex, endIndex);

  //Re-render default state 1
  useEffect(()=>{
    setCurrentPage(1)
  },[id])

  //Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>    
      {
        articles.length > 0 ?
          displayedArticles && displayedArticles.map(element => {
            if (type === 'question') {
              return <QuestionDetail question={element} key={uuidv4()} />
            } else if (type === 'review') {
              return <ReviewDetail review={element} key={uuidv4()} />
            } else if (type === 'uploadFile') {
              return <UploadFileDetail uploadFile={element} key={uuidv4()} />
            } // Add more conditions as needed
            return null; // Add a default return case if necessary
          }) : null

      }
   
   

      {/* แสดง Pagination */}
      <Pagination style={{ justifyContent: 'center' , marginBottom:'0px'}} >
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {Array(totalPages).fill().map((_, index) => (
          <Pagination.Item
            key={uuidv4()}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    </div>
  );
}

export default PaginationPage;