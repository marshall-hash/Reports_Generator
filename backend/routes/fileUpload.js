const express = require('express');
const router = express.Router();
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const excelFile = req.file;
  if (!excelFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }  
  res.send('Data received successfully');
  console.log('Received file:', excelFile.originalname);
});

module.exports = router;
