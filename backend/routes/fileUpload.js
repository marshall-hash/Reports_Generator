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
  res.send();

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  res.send('Data received successfully',data);

//const schoolName = worksheet['B1'].v;
//const term = worksheet['B2'].v;
//const teacher = value.split(':')[1].trim();

});

module.exports = router;
