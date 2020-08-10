import React from "react";
import "./App.css";

import Audio from "./components/Audio";

const filename = "together.mp3";

const src = require(`./assets/${filename}`);

function App() {
  return (
    <div className="App">
      <Audio src={src} filename={filename} />
    </div>
  );
}

export default App;
