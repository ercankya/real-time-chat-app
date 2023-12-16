import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-header-list">
        <p>User List</p>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <div>
              <div
                className={`status-dot ${
                  user.status === "Active" ? "online" : "offline"
                }`}
              ></div>
              <strong>{user.username}</strong>
              <span>{`${new Date(user.joinDate).getHours()}:${new Date(
                user.joinDate
              ).getMinutes()}`}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
