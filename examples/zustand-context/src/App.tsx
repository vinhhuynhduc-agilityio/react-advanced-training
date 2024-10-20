// src/App.tsx
import React from 'react';
import BearCounter from './components/BearCounter';
import UserList from './components/UserList';
import { UserStoreProvider } from './context/UserStoreProvider';
import { BearStoreProvider } from './context/BearStoreProvider';

const App: React.FC = () => {
  return (
    <BearStoreProvider>
      <UserStoreProvider>
        <div>
          <h1>Zustand with Multiple Stores and Context Example</h1>
          <BearCounter />
          <UserList />
        </div>
      </UserStoreProvider>
    </BearStoreProvider>
  );
};

export default App;
