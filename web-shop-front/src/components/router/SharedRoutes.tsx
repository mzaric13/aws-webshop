import React, { PropsWithChildren, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getRole } from "../../services/token-service";

const SharedRoutes = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const role = getRole();
    if (!role || role === "undefined" || role === "USER") {
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
export default SharedRoutes;
