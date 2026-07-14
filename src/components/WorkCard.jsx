import React from 'react';

export default function WorkCard({ url, title }) {
  return <a href={url} className="m-work-card">{title}</a>;
}
