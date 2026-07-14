import React from 'react';

/**
 * @param {object}          params
 * @param {string}          params.title
 * @param {boolean}         [params.open]
 * @param {React.ReactNode} [params.children]
 * @returns
 */
export default function WorkSection({ title, open = false, children }) {
  return <section className="work-section">
    <details open={open}>
      <summary><h2>{title}</h2></summary>
      {children}
    </details>
  </section>;
}