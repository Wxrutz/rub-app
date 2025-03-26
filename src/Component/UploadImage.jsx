import React, { useState } from 'react';

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState('');
  const [accuracy, setAccuracy] = useState(null); // Added state for accuracy
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    setSelectedFile(file);
    setShowErrorPopup(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setShowErrorPopup(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        setAccuracy(data.accuracy); // Set accuracy from response
      } else {
        setResult('Error: Unable to process the image');
        setAccuracy(null); // Reset accuracy on error
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setResult('Error: Something went wrong');
      setAccuracy(null); // Reset accuracy on error
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="main-container">
      <div className="background-overlay"></div>
      <div className="hero">
        <h1>การจำแนกอายุยางพารา</h1>
      </div>
      <main className="upload-container">
        
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleFileChange}
          className="choise-image"
        />
        <label htmlFor="file-upload" className="file-label">เลือกภาพสำหรับการจำแนก</label>
        {preview && <img src={preview} alt="Preview" className="image-preview" />}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="cssbuttons-io"
        >
          {loading ? 'Classifying...' : 'จำแนกภาพ'}
        </button>
      </main>

      {/* Popup for result */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>ผลลัพธ์การจำแนก</h2>
            <p>สวนยางพาราสวนนี้อายุประมาณ: {result} ปี</p>
            {accuracy !== null && <p>ความแม่นยำ: {accuracy.toFixed(2)}%</p>} {/* Display accuracy */}
            <button onClick={() => setShowPopup(false)}>ปิด</button>
          </div>
        </div>
      )}

      {/* Popup for error */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>ข้อผิดพลาด</h2>
            <p>กรุณาเลือกรูปภาพก่อน!</p>
            <button onClick={() => setShowErrorPopup(false)}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImage;