import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { baseUrl } from "../utils/Util";
import { deleteToken, getAccessToken, getIdToken } from "./token-service";

export const configuteAxios = (navigate: NavigateFunction) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getIdToken();
      if (token) {
        if (config.url?.endsWith("auth/logout"))
          config.headers["Authorization"] = getAccessToken();
        else config.headers["Authorization"] = token;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${baseUrl}/auth/login`
      ) {
        navigate("/login");
        return Promise.reject(error);
      }
      if (error.response.status === 401 && !originalRequest._retry) {
        deleteToken();
        navigate("/");
      }
      if (error.response.status === 403) {
        deleteToken();
        navigate("/");
      }
      console.log(error);
      return Promise.reject(error);
    }
  );
};
