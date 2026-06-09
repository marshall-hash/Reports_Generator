const xlsx = require('xlsx');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 1738;
const reports = require('./routes/pdfMaker');
const fileUpload = require('./routes/fileUpload');


app.use(cors());
app.use(express.json());
app.use('/upload', fileUpload);
app.use('/reports', reports);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});