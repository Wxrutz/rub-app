import React from "react";
import UploadImage from "./Component/UploadImage";

function App() {
  const background = "url('/assets/rubber1.jpg')";

  return (
    <div
      className=""
      style={{
        backgroundImage: background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      <UploadImage />
    </div>
  );
}

export default App;
