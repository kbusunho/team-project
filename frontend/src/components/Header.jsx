import React from 'react';
import './Header.css';

const Header = ({ users, selectedUser, onSelectUser }) => {
  return (
    <header className="header">
      <h1 className="title">🌟 버킷리스트🚀</h1>
      <div className="user-list">
        {users.map(user => (
          <button
            key={user.uid}
            className={`user-btn ${selectedUser?.uid === user.uid ? 'active' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            {user.name}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;