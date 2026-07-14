import React from 'react';

export default function ResultsData({ value, label }) {
  return <div className="l-container">
    <div className="m-results-data l-sidebar l-sidebar--baseline">
      <strong>{value}</strong>
      <span className="l-sidebar__main">{label}</span>
    </div>
  </div>;
}