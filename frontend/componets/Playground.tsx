import axios from 'axios'
import { useEffect, useState } from 'react'

interface ReportData {
  classTeacher: string;
  studentName: string;
  studentClass: string;
  monthYear: string;
  subject: string;
  assessmentMark: string;
  comment: string;
}

const Playground =  () => {

     const [pdfData, setPdfData] = useState<ReportData[]>([]);
     useEffect(() => {   
     axios.get('http://localhost:1738/reports')
      .then(res=> setPdfData(res.data))}, [])
  return (
    
    <>
        {pdfData.map((data, index) => (
          <div key={index} className="report-container">

          <h1 className="school-name">ZRP HIGH SCHOOL</h1>

          <div className="header">
              <div className="left-info">
                  <p>P.O. Box BW 866</p>
                  <p>Borrowdale</p>
                  <p>highschool.zrp@gmail.com</p>
              </div>

              <div className="logo-section">
                  <img src="logo.png" alt="School Logo"/>
              </div>

              <div className="right-info">
                  <p>Phone: 0242 860533</p>
              </div>
          </div>

          <h2 className="report-title">HOLIDAY TUTORIAL LESSONS REPORT</h2>

          <div className="student-details">
              <div className="row">
                  <span>STUDENT NAME:</span>
                  <span>{data.studentName}</span>
              </div>

              <div className="row">
                  <span>FORM: FOUR (4)</span>
                  <span>MONTH/YEAR: {data.monthYear}</span>
              </div>

              <div className="row">
                  <span>SUBJECT: {data.subject}</span>
                  <span>ASSESSMENT MARK: {data.assessmentMark}%</span>
              </div>
          </div>

          <div className="comment-section">
              <h3>COMMENT</h3>

              <p>
                {data.comment}
              </p>
          </div>

          <div className="footer-section">

              <div className="tutor-section">
                  <p>TUTORS NAME</p>
                  <p>{data.classTeacher}</p>

                  <div className="signature-area">
                      ............................................
                  </div>

                  <p>SIGNATURE</p>
              </div>

              <div className="stamp-section">
                  <p>DIRECTOR OF STUDIES SIGNATURE</p>

                  <div className="director-signature">
                      ............................................
                  </div>

                  <div className="stamp-box"></div>
              </div>

          </div>

          <div className="bottom-notes">
              <span>Issued without alterations</span>
              <span>Official school stamp</span>
          </div>

      </div>))}
    </>
    
    )
}
export default Playground