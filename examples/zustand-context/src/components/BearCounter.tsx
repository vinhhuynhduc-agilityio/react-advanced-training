import React from 'react';
import { useBearStoreContext } from '../context/BearStoreContext';

const BearCounter: React.FC = () => {
  const { bears, increaseBears } = useBearStoreContext();

  return (
    <div>
      <h1>Bears: {bears}</h1>
      <button onClick={increaseBears}>Increase Bears</button>
    </div>
  );
};

export default BearCounter;
