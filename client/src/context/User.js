import React, { useEffect } from "react";
import jwt from "jsonwebtoken";

const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [state, setState] = React.useState({});

  const update = data => {
    setState(prevState => ({ ...prevState, ...data }));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const canEdit = objectType => {
    if (Array.isArray(state.groups) && state.groups.includes("superusers"))
      return true;
    return false;
  };

  const canView = objectType => {
    if (Array.isArray(state.groups) && state.groups.includes("superusers"))
      return true;
    return false;
  };
  useEffect(() => {
    const decoded = jwt.decode(localStorage.getItem("accessToken"));
    setState(prevState => ({ ...prevState, ...decoded.data }));
  }, []);

  return (
    <UserContext.Provider
      value={{ ...state, update, logout, canView, canEdit }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
