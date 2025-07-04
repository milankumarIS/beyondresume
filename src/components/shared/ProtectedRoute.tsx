import React, { useEffect, useContext } from "react";
import { Route, Redirect } from "react-router";
import { getUserId } from "../../services/axiosClient";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, path }) => {


  useEffect(() => {
    if(getUserId() === 0) {
      localStorage.clear();
    }
  }, [Component, path]);

  return (
    <Route path={path} render={() => getUserId() !== 0 ? <Component />: <Redirect to="/login" />} />
  );
};