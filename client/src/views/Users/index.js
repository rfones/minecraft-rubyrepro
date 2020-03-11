import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`).then(response => {
      let data = response.data;
      data.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      setUsers(data);
    });
  }, []);

  return (
    <>
      <Typography variant="h5" component="h2">
        Whitelisted Users
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Op?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.name}>
                <TableCell scope="row">
                  <div style={{ display: "flex" }}>
                    <img
                      src={`https://crafatar.com/avatars/${user.uuid}`}
                      alt={user.name}
                      width="20"
                      height="20"
                      style={{ marginRight: 8 }}
                    />
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>
                  {user.level && user.level > 0 ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
