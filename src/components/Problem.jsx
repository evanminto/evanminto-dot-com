import React from 'react';

export default function Problem({ title, children }) {
  return <div className="m-problem">
    <h2>{title}</h2>
    <p>{children}</p>
  </div>;
}
