import React, { useEffect } from "react";
import jwt from "jsonwebtoken";

const UserContext = React.createContext();

export function UserProvider({ children }) {
  const updateUser = data => {
    console.log("updateUser", { ...state, ...data });
    setState(prevState => ({ ...prevState, ...data }));
  };

  const [state, setState] = React.useState({
    update: updateUser
  });

  useEffect(() => {
    const decoded = jwt.decode(localStorage.getItem("accessToken"));
    setState(prevState => ({ ...prevState, ...decoded.data }));
  }, []);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
