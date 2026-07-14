import React from 'react';

export default function Summary({ url, title, subtitle, img, description }) {
  return <section className="m-summary">
    <div className="l-stack">
      <h3>
        <a href={url}>{{ title }}</a>
      </h3>

      {subtitle && <p className="m-summary__subtitle">{subtitle}</p>}

      {img && <img
        src={img.src}
        alt={img.alt}
        className="u-reorder-first"
        style={img.focalPoint && `--focal-point: ${img.focalPoint}`}
      />}

      {description && <p>{{ description }}</p>}
    </div>
  </section>;
}
