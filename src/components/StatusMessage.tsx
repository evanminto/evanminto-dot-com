import type { Ref } from "react";

export const StatusMessage = ({ type, children, innerRef }: {
  type: 'success' | 'error';
  children: any;
  innerRef?: Ref<HTMLOutputElement>;
}) => (
  <output
    className={`status-message status-message--${type}`}
    role="alert"
    tabIndex={-1}
    ref={innerRef}
  >
    {children}
  </output>
);
