import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h3>Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <img src={user.avatar} alt="User Avatar" />
            <div>
              <strong>{user.username}</strong>
              <span>{user.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;