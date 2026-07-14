import React from 'react';

export default function Phase({ title, image, children }) {
  return <div className="m-phase">
    <h2>{title}</h2>
    {image && image.src && <img src={image.src} alt={image.alt} />}
    {children}
  </div>;
}
