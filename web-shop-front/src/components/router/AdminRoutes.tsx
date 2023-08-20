import React, { PropsWithChildren, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getIdToken, getRole } from "../../services/token-service";

const AdminRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = getIdToken();
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
      return navigate("/");
    }
    const role = getRole();
    if (role === "ADMIN") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      return navigate("/products");
    }
  };

  useEffect(() => {
    checkUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? <Outlet /> : null}</React.Fragment>;
};
export default AdminRoutes;
