import React, { memo } from 'react';

// Define the type for props
type ChildProps = {
  message: string;
};

// Define the Child component and wrap it with React.memo
const Child: React.FC<ChildProps> = memo(({ message }) => {
  console.log('Child rendered');
  return <div>{message}</div>;
});

export { Child };
