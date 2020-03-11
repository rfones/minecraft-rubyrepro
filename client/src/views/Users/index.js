import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`).then(response => {
      let data = response.data;
      data.sort((a, b) => {
        a.name > b.name;
      });
      setUsers(data);
    });
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>UUID</th>
            <th>Op?</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr>
              <td>
                <img
                  src={`https://crafatar.com/avatars/${user.uuid}`}
                  alt={user.name}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.uuid}</td>
              <td>{user.level & (user.level > 0) ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
