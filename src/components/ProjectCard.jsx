import React from 'react';

/**
 *
 * @param {object} params
 * @param {string} [params.class]
 * @param {string} params.url
 * @param {{ src: string; alt: string; width: number; height: number; }} params.img
 * @param {string} [params.title]
 * @returns
 */
export default function ProjectCard({ class: className, url, img, title }) {
  return (
    <article className={`m-project-card ${className || ''}`}>
      <a href={url}>
        <img
          src={img.src}
          width={img.width}
          alt={img.alt}
          height={img.height}
          loading="lazy"
        />

        {title && <h3>{title}</h3>}
      </a>
    </article>
  );
}
