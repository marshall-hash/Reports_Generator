import React from 'react'

const Playgroud = () => {
  return (
    <>
      <div className="report-container">

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
                  <span>Tafadzwa Mugoni</span>
              </div>

              <div className="row">
                  <span>FORM: FOUR (4)</span>
                  <span>MONTH/YEAR: APRIL/2026</span>
              </div>

              <div className="row">
                  <span>SUBJECT: BIOLOGY</span>
                  <span>ASSESSMENT MARK: 64%</span>
              </div>
          </div>

          <div className="comment-section">
              <h3>COMMENT</h3>

              <p>
                  The student performs better when paying attention.
                  Please advise to read more and study past exam papers.
              </p>
          </div>

          <div className="footer-section">

              <div className="tutor-section">
                  <p>TUTORS NAME</p>
                  <p>MR MUGONI</p>

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

      </div>
    </>
)}

export default Playgroud