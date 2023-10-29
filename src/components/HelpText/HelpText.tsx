import React from "react";

export default function HelpText({ message }: { message?: string }) {
  if (!message) return null;

  return <small className="d-block text-muted w-100">{message}</small>;
}
