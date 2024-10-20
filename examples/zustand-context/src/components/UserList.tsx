import React, { useState } from 'react';
import { useUserStoreContext } from '../context/UserStoreContext';

const UserList: React.FC = () => {
  const { users, addUser } = useUserStoreContext();
  const [userName, setUserName] = useState('');

  const handleAddUser = () => {
    addUser(userName);
    setUserName('');
  };

  return (
    <div>
      <h2>User List:</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter user name"
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default UserList;
