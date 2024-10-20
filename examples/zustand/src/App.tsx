// App.tsx
import React, { useEffect } from 'react';
import { useBearStore } from './store';

const App: React.FC = () => {

  // Get multiple state parts from store
  const bears = useBearStore((state) => state.bears);
  const users = useBearStore((state) => state.users);
  const increaseBears = useBearStore((state) => state.increaseBears);
  const fetchUsers = useBearStore((state) => state.fetchUsers);
  const resetBears = useBearStore((state) => state.resetBears);

  // Fetch data when component mounts, only call fetchUsers once
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]); // Fetch only when users are empty

  return (
    <div>
      <h1>Bears Count: {bears}</h1>
      <button onClick={increaseBears}>Increase Bears</button>
      <button onClick={resetBears}>Reset Bears</button>

      <h2>Users List:</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => <li key={index}>{user}</li>)
        ) : (
          <p>Loading users...</p>
        )}
      </ul>
    </div>
  );
};

export default App;
