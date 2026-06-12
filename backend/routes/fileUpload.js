const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
const multer = require('multer');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });


let reports = [];

router.post('/', upload.single('file'), async (req, res) => {
  const getComment = (score, studentName) => {
        if (score >= 90){
          const comment = [
            "Outstanding performance. Demonstrates exceptional understanding of concepts and consistently produces high-quality work. Keep up the excellent effort.",
             `${studentName} is an excellent learner who shows remarkable dedication, initiative, and mastery of the subject matter.`,
              "Consistently exceeds expectations through hard work, commitment, and a positive attitude towards learning.",
              ` ${studentName} displays exceptional academic ability and maintains an impressive standard of achievement throughout.`
          ]
          return comment[Math.floor(Math.random() * comment.length)];
        } 

        if (score >= 80) {
          const comment = [
            "Very good achievement. Shows a strong grasp of the subject matter and works diligently. Continue striving for excellence.",
            ` ${studentName} works diligently and demonstrates a commendable understanding of the subject matter.`,
            "Produces quality work and consistently performs well in assessments and classroom activities.",
            ` ${studentName} shows strong commitment to learning and continues to make excellent progress.`
          
          ];
          return comment[Math.floor(Math.random() * comment.length)];
        }
        if (score >= 70){
          const comment = [
            "Good performance. Demonstrates a sound understanding of most concepts and participates positively in learning activities.",
            ` ${studentName} shows steady progress and is encouraged to continue building on current strengths.`,
            ` ${studentName} performs well in most areas and demonstrates a positive attitude towards learning.`,
            ` ${studentName} has achieved a good standard and should continue applying consistent effort.`
          ]
          return comment[Math.floor(Math.random() * comment.length)];
        } 

        if (score >= 60){
          const comment = [ 
            ` ${studentName} demonstrates satisfactory progress. Understands key concepts but should focus on improving consistency and attention to detail.`,
            ` ${studentName} demonstrates an acceptable level of understanding and is encouraged to participate more actively.`,
            ` ${studentName} has achieved satisfactory results and can improve further through additional effort and practice.`,
            ` ${studentName} shows potential and should continue working steadily to strengthen academic performance.`
          ]
          return comment[Math.floor(Math.random() * comment.length)];
        }

        if (score >= 50){
            const comment = [
              ` Fair achievement. ${studentName} has shown some understanding of the material but requires additional effort and practice to improve performance.`,
             `${studentName} needs to apply greater focus and consistency to improve overall performance.`,
              ` ${studentName} demonstrates basic understanding but should practice regularly to strengthen skills.`,
              ` ${studentName} can achieve better results through increased commitment and attention to assigned tasks.`
            ]
            return comment[Math.floor(Math.random() * comment.length)];
        } 

        if (score >= 40){
            const comment = [ 
              "Below average performance. Needs to work harder, complete assignments consistently, and seek assistance when concepts are unclear.",
              "Requires greater effort and participation to improve understanding and achievement.",
              ` ${studentName} should focus on completing assignments consistently and developing better study habits.`,
              "Has the ability to improve but must demonstrate increased commitment to learning."
            ]
            return comment[Math.floor(Math.random() * comment.length)];
        } 

        if (score >= 30){
          const comment = [
            "Limited achievement. Significant improvement is needed through increased effort, regular study habits, and active participation in class.",
             `${studentName} struggles to meet expected standards and should seek additional academic support.`,
              ` ${studentName} must develop stronger study habits and participate more actively in learning activities.`,
              ` ${studentName} requires considerable improvement in understanding and application of key concepts.`
          ]
          return comment[Math.floor(Math.random() * comment.length)];
        } 

        if (score >= 20) {
          const comment = [
            "Poor performance. Struggles to meet expected standards and requires considerable support and commitment to improve.",
             ` ${studentName} has not demonstrated sufficient understanding of the subject and requires significant support.`,
              ` ${studentName} needs urgent improvement in study habits, participation, and commitment to learning.`,
              "Performance is well below expectations and requires focused attention and assistance."
          ]
          return comment[Math.floor(Math.random() * comment.length)];
        }
        return "Very poor performance. Has not demonstrated sufficient understanding of the subject. Immediate intervention and increased effort are strongly recommended.";
    }
const  getFirstName =(fullName) =>{
  const names = fullName.trim().split(/\s+/);
  const firstName = names[names.length - 1];
  return firstName.charAt(0).toUpperCase() +
         firstName.slice(1).toLowerCase();
}
  try {
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }
    
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1
    });

    const classDetails = {
      classTeacher: rows[0][1] || 'No cell found',
      class: rows[1][1] || 'No cell found',
      subject: rows[2][1] || 'No cell found',
      term: rows[3][1] || 'No cell found'
    };

    const headerRowIndex = rows.findIndex(row =>
      row.includes('Name') && row.includes('Final')
    );

    const headers = rows[headerRowIndex];
    const nameColumn = headers.indexOf('Name');
    const finalColumn = headers.indexOf('Final');
    const students = [];

    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];

      if (!row[nameColumn] || row[nameColumn] === 'TOTAL') {
        continue;
      }
      

      students.push({
        name: row[nameColumn],
        final: row[finalColumn]
      });
    }
    const formatedStudents = students.map(student => ({
      name: student.name,
      final: Math.round(student.final)
    }));
    fs.unlinkSync(req.file.path);
    reports = students.map(student => ({
      classTeacher: classDetails.classTeacher,
      studentClass: classDetails.class,
      subject: classDetails.subject,
      monthYear: classDetails.term,
      studentName: student.name,
      firstName: student.name.split(' ')[0],
      assessmentMark: Math.round(student.final),
      comment: getComment(Math.round(student.final),
       getFirstName(student.name))
    }));
    
    res.status(200).json({
      message: 'Upload successful',
      students: reports.length
    });

}
catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({
      error: error.message
    });

  }});

 
router.get('/download', async (req, res) => {
  try {
    const browser = await puppeteer.launch({

      executablePath:  process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true, 
    });

    const page = await browser.newPage();
    const pages = reports.map(student => `
        <div class="report-container">

            <h1 class="school-name">ZRP HIGH SCHOOL</h1>

            <div class="header">
                <div class="left-info">
                    <p>P.O. Box BW 866</p>
                    <p>Borrowdale</p>
                    <p>highschool.zrp@gmail.com</p>
                </div>

                <div class="logo-section">
                    <img src="http://localhost:1738/assets/Capture.PNG" alt="School Logo"/>
                </div>

                <div class="right-info">
                    <p>Phone: 0242 860533</p>
                </div>
            </div>

            <h2 class="report-title">HOLIDAY TUTORIAL LESSONS REPORT</h2>

            <div class="student-details">

                <div class="row">
                    <span>STUDENT NAME:</span>
                    <span style="font-weight: bold;" class="student-name">${student.studentName}</span>
                </div>
                <div class="info-grid">
                    <div class="row student-form">
                      <span>FORM:</span>
                      <span style="font-weight: bold;">${student.studentClass}</span>
                    </div>

                    <div class="row month">
                      <span>MONTH/YEAR:</span>
                      <span style="font-weight: bold;">${student.monthYear}</span>
                    </div>

                    <div class="row subject">
                      <span>SUBJECT:</span>
                      <span style="font-weight: bold;">${student.subject}</span>
                    </div>

                    <div class="row mark">
                      <span>ASSESSMENT MARK:</span>
                      <span style="font-weight: bold;">${student.assessmentMark}%</span>
                    </div>
                </div>

               

            </div>

            <div class="comment-section">
                <h3>COMMENT</h3>
                <p>${student.comment}</p>
                <p class="first-p">Other comments: .............................................................................................................................</p>
                <p>..........................................................................................................................................................</p>
                <p>..........................................................................................................................................................</p>
            </div>

            <div class="footer-section">

                <div class="tutor-section">
                    <p>TUTOR'S NAME</p>
                    <p style="font-weight: bold;" class="tutors-name">${student.classTeacher}</p>

                    <div class="tutor-sign">
                      <div class="signature-line tutor-sign"></div>
                      <p class="tutor-signature-label">SIGNATURE</p>
                    </div>
                    
                </div>

                <div class="stamp-section">

                    <p>DIRECTOR OF STUDIES SIGNATURE</p>

                    <div class="signature-line"></div>

                    <div class="stamp-box"></div>
                </div>
            </div>
            <div class="bottom-notes">
                <span>Issued without alterations</span>
                <span>Official school stamp</span>
            </div>

        </div>
        `).join('');
    const HTMLContent = `
    <html>
      <head>
        <style>
          @page {
              size: A6;
              margin: 4mm;
          }

          *{
              box-sizing:border-box;
              margin:0;
              padding:0;
          }

          body{
              font-family:Arial, Helvetica, sans-serif;
              background:white;
              width:100%;
              height:100%;
          }

          .report-container{
              width:100%;
              min-height:140mm;
              border: 1px solid black;
              padding:8px;
              display:flex;
              flex-direction:column;
              page-break-after:always;
          }
          .report-container:last-child{
              page-break-after:auto;
            }
          .school-name{
              text-align:center;
              font-size:14px;
              font-weight:600;
              margin-bottom:20px;
          }

          .header{
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:8px;
          }

          .left-info,
          .right-info{
              width:30%;
              font-size:7px;
              line-height:1.3;
          }

          .right-info{
              text-align:right;
          }

          .logo-section{
              width:40%;
              text-align:center;
          }

          .logo-section img{
              width:50px;
              height:50px;
              object-fit:contain;
          }

          .report-title{
              text-align:center;
              font-size:10px;
              font-weight:600;
              margin:20px 0 20px 0;
          }

          .info-grid{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px 15px;
            margin: 10px 0 20px 0;
          }
          

          .row{
              display:flex;
              align-items:flex-start;
              font-size:8px;
              gap:4px;
              margin: 5px 0;
              
          }
          .tutor-sign{
           margin-top: 30px;
        
          }
          .tutors-name{
            font-weight: bold;
            margin-top:15px;
          }
              
          .student-name{
            position: sticky;
            left: 18%;
            font-weight: bold;
          }

          

          .comment-section{
              margin-bottom:0px;
          }
          

          .comment-section h3{
              text-align:center;
              font-size:9px;
              margin-bottom:12px;
              font-weight:600;
          }
            .comment-section .first-p{
              margin-top:15px;
            }

          .comment-section p{
              font-size:8px;
              line-height:1.4;
              text-align:left;
              padding:0 4px;
              margin-top: 6px;
          }
          
          
            
          .footer-section{
              display:flex;
              justify-content:space-between;
              gap:10px;
              margin-top:auto;
          }

          .tutor-section,
          .stamp-section{
              width:48%;
              margin-bottom:8px;
          }
         
          
          .tutor-section p,
          .stamp-section p{
              font-size:7px;
              margin-bottom:7px;
          }

          .signature-line{
              border-bottom:1px dotted #000;
              height:11px;
              margin-right:50px;
              margin-bottom:7px;
          }

          .stamp-box{
              width:100%;
             
              height:70px;
              border:1px solid #999;
              background:#dff0df;
              margin-top:9px;
          }

          .bottom-notes{
              display:flex;
              justify-content:space-between;
              margin-top:8px;
              font-size:8px;
              font-style:italic;
          }
          
        </style>
      </head>
      <body>
        ${pages}
      </body>
    </html>`;


    await page.setContent(HTMLContent);
    const pdfBuffer = await page.pdf({
          format: 'A6',
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
              top: '0',
              right: '0',
              bottom: '0',
              left: '0'
          }
      });
    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=report.pdf',
    });
    res.send(pdfBuffer);

  } 
  catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});



module.exports = router;

