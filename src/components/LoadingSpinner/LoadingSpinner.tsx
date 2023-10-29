import React from "react";

export default function LoadingSpinner({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span
      className="spinner-border spinner-border-sm me-2"
      role="status"
      aria-hidden="true"
    />
  );
}
