const xlsx = require('xlsx');
const cors = require('cors');
const express = require('express');
const app = express();
const fileUpload = require('./routes/fileUpload');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/reports', fileUpload);
app.use('/assets', express.static(path.join(__dirname)));

const port = process.env.PORT || 1738;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});