import axios from "axios";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../src/App"



function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    await axios.post('http://localhost:1738/upload', formData)
      .then(res => console.log(res.data))
    await axios.get('http://localhost:1738/upload/reports')
      .then(res => console.log(res.data));
    navigate('/playground');
  }
 
  return (
    < div className="App-container">
      <h1>Welcome to the ZRP High School Vacation Reports Generator</h1>

      <p>
        To get started, please click the upload button below to generate your
        vacation report.
      </p>

      <label htmlFor="file-upload">
        Click below to upload Excel Document
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setSelectedFile(file);
        }}
      />
      <button onClick={handleFileUpload}>Generate Reports</button>
   
    </div>
  );
}

export default Main;


