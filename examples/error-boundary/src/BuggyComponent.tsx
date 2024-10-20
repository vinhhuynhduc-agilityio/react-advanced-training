import React, { useState } from 'react';

const BuggyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  // Simulate a crash when count reaches 3
  if (count === 3) {
    throw new Error('Counter reached 3, component crashed!');
  }

  return (
    <div>
      <h2>Buggy Component</h2>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Counter</button>
    </div>
  );
};

export default BuggyComponent;
