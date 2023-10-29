import React from 'react';

export default function Error({ message }: { message?: string }) {
  if (!message) return null;

  return <div className='d-block invalid-feedback'>{message}</div>;
}
