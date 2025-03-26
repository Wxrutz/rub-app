import React from "react";
import UploadImage from "./Component/UploadImage";


function App() {
  return (
    <div className="" 
    style={{ backgroundImage: "url('public/assets/rubber2.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
     
        <UploadImage />
      
    </div>
  );
}

export default App;
