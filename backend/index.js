const xlsx = require('xlsx');
const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();
const fileUpload = require('./routes/fileUpload');

app.use(cors());
app.use(express.json());

app.use('/reports', fileUpload);

// Serves backend/Capture.PNG
app.use('/assets', express.static(__dirname));

const port = process.env.PORT || 1738;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});