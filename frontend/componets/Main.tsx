import axios from "axios";
import  { useState } from "react";

import "../src/App"



function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
   const downloadReport = async () => {
      try {
        const response = await axios.get(
          'http://localhost:1738/reports/download',
          {
            responseType: 'blob',
          }
        );

        // FIX: wrap response.data in Blob
        const blob = new Blob([response.data], {
          type: 'application/pdf',
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'report.pdf';

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Error downloading report:', error);
      }
    };
  const handleFileUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file first.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Upload and generate reports
    await axios.post(
      "http://localhost:1738/reports",
      formData
    );

    // Download generated report
    await downloadReport();

  } catch (error: unknown) {
    console.error('FULL ERROR:', error);

    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};
 
  return (
  <>
    {loading && (
      <div className="overlay">
        <div className="popup">
          <div className="spinner"></div>
          <p>Please wait while reports are being generated...</p>
        </div>
      </div>
    )}
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
  </>
  );
}

export default Main;


