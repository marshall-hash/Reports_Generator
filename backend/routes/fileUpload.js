const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');



const upload = multer({ dest: 'uploads/' });
let reports = [];

router.post('/', upload.single('file'), (req, res) => {
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
 
  reports = students.map(student => ({
  classTeacher: classDetails.classTeacher,
  studentClass: classDetails.class,
  subject: classDetails.subject,
  monthYear: classDetails.term,
  studentName: student.name,
  assessmentMark: Math.round(student.final),
  comment: 'This is a comment'
  }));


  res.status(200).json(reports);


}
catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({
      error: error.message
    });

  }});
router.get('/reports', (req, res) => {
  res.send(reports);
}
);


module.exports = router;
