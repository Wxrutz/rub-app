import React, { useState, useEffect } from 'react';

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [bgIndex, setBgIndex] = useState(0); // State for background index

  const backgrounds = [
    'url("/path/to/bg1.jpg")',
    'url("/path/to/bg2.jpg")',
    'url("/path/to/bg3.jpg")',
  ]; // Array of background images

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 10000); // Change background every 10 seconds
    return () => clearInterval(interval);
  }, [backgrounds.length]);

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

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    setSelectedFile(file);
    setShowErrorPopup(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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
    <div
      className="main-container"
      style={{ backgroundImage: backgrounds[bgIndex] }} // Dynamic background
    >
      <div className="background-overlay"></div>
      <div className="hero">
        <h1 className="typing-effect">การจำแนกอายุยางพารา</h1> {/* Added typing-effect class */}
      </div>
      <main
        className="upload-container"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
        <div className={`popup-overlay ${showPopup ? 'active' : ''}`}>
          <div className="popup-content">
            <h2>ผลลัพธ์การจำแนก</h2>
            <p>สวนยางพาราสวนนี้อายุประมาณ: {result} ปี</p>
            {accuracy !== null && <p>ความแม่นยำ: {accuracy.toFixed(2)}%</p>} {/* Display accuracy */}
            <button onClick={() => { setShowPopup(false); refreshPage(); }}>ปิด</button>
          </div>
        </div>
      )}

      {/* Popup for error */}
      {showErrorPopup && (
        <div className={`popup-overlay ${showErrorPopup ? 'active' : ''}`}>
          <div className="popup-content">
            <h2>ข้อผิดพลาด</h2>
            <p>กรุณาเลือกรูปภาพก่อน!</p>
            <button onClick={() => { setShowErrorPopup(false); refreshPage(); }}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImage;