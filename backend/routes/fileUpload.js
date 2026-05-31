const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const pdfGenerater = require('../functions/pdfGenerater');


const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const excelFile = req.file;
  const workbook = XLSX.readFile(req.file.path);
  if (!excelFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  const rows = XLSX.utils.sheet_to_json(worksheet, {
  header: 1
});


  const classDetails = {
    classTeacher: rows[0][1] || 'No cell found',
    class: rows[0][2] || 'No cell found',
    subject: rows[0][3] || 'No cell found',
    term: rows[0][4] || 'No cell found'
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



  res.send(formatedStudents);


});

module.exports = router;
