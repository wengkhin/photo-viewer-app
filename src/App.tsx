import React from "react";
import "./App.scss";
import Dropdown from "./component/Dropdown";

function App() {
  return (
    <div>
      <h1>Photo Viewer</h1>
      <Dropdown data={[]} />
      Text below here
    </div>
  );
}

export default App;
