import React from "react";

import Users from "./Users";

const Dashbaord = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
        <h1>minecraft.rubyrepro.com</h1>
        <p>Welcome {user.name}</p>
      <Users />
    </div>
  );
};

export default Dashbaord;
