import React from 'react';

export default function Project({
  title,
  subtitle,
  detail,
  startDate,
  endDate,
  img,
  description,
  viewUrl,
}) {
  return (
    <article className="o-project">
      <header>
        {title && <h1>{title}</h1>}

        {subtitle ? (
          <p className="o-project__subtitle">{subtitle}</p>
        ) : detail || startDate || endDate ? (
          <p className="o-project__subtitle">
            {startDate}
            {endDate && <> – {endDate}</>}
            {startDate && detail && <> | {detail}</>}
          </p>
        ) : (
          ''
        )}
      </header>

      {img && <img src="{{ img.src }}" alt="{{ img.alt }}" />}
      {description && <p>{{ description }}</p>}
      {viewUrl && <a href="{{ viewUrl }}">View Project</a>}
    </article>
  );
}
