import React, { PropsWithChildren, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getRole, getToken } from "../../services/token-service";

const UserRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = getToken();
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
      return navigate("/");
    }
    const role = getRole();
    if (role === "USER") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      return navigate("/admin-products");
    }
  };

  useEffect(() => {
    checkUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? <Outlet /> : null}</React.Fragment>;
};
export default UserRoutes;
