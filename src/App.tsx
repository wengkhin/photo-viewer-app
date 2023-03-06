import React from "react";
import "./App.scss";
import { Dropdown, Item } from "./component/Dropdown";

function App() {
  const dropdownData: Item[] = [...Array(10)].map((x, i) => ({
    key: i.toString(),
    text: `Text ${i}`,
    value: i,
  }));

  return (
    <div>
      <h1>Photo Viewer</h1>
      <Dropdown data={dropdownData} />
      Text below here
    </div>
  );
}

export default App;
