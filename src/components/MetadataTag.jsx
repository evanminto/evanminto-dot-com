import React from 'react';

/**
 * @param {object} params
 * @param {string} params.name
 * @param {React.ReactNode} params.children
 * @returns {React.ReactNode}
 */
export default function MetadataTag({ name, children }) {
  return <p className="a-metadata-tag">
    <span className="a-metadata-tag__key">{name}</span>
    <span className="a-metadata-tag__value">{children}</span>
  </p>;
}