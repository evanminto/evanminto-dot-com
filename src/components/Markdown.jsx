import MarkdownToJsx from 'markdown-to-jsx';
import React from 'react';

/**
 * @param {object} params
 * @param {string} params.str
 * @returns {React.ReactNode}
 */
export default function Markdown({ str }) {
  return <MarkdownToJsx>{str}</MarkdownToJsx>
}
