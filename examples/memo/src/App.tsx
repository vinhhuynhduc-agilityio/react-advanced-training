import React, { useState } from 'react';
import { Child } from './Child';

// Parent component
const Parent: React.FC = () => {
  const [message, setMessage] = useState('Hello, World!');
  const [count, setCount] = useState(0);

  // Handler to change the message
  const changeMessage = () => {
    setMessage('Hello, React!');
  };

  // Handler to increment the counter
  const incrementCounter = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <button onClick={changeMessage}>Change Message</button>
      <button onClick={incrementCounter}>Increment Counter</button>
      <Child message={message} />
      <p>Counter: {count}</p>
    </div>
  );
};

export default Parent;
