// LayoutCustomizer.js

import React, { useState, useEffect } from "react";

const LayoutCustomizer = ({ onLayoutChange, onStyleChange }) => {
  const [selectedLayout, setSelectedLayout] = useState("grid");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Notify parent about layout change
    if (onLayoutChange) {
      onLayoutChange(selectedLayout);
    }
  }, [selectedLayout, onLayoutChange]);

  useEffect(() => {
    // Notify parent about style change
    if (onStyleChange) {
      onStyleChange(theme);
    }
  }, [theme, onStyleChange]);

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Customize Layout and Theme</h3>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="layout-select">Select Layout: </label>
        <select
          id="layout-select"
          value={selectedLayout}
          onChange={(e) => setSelectedLayout(e.target.value)}
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
          <option value="column">Column</option>
        </select>
      </div>
      <div>
        <label htmlFor="theme-select">Select Theme: </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );
};

export default LayoutCustomizer;
