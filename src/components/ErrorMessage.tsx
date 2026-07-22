import type { Ref } from "react";

export const ErrorMessage = ({ children }: {
  children: any;
}) => (
  <output className="error-message">{children}</output>
);
