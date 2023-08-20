import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { baseUrl } from "../utils/Util";
import { deleteToken, getToken } from "./token-service";

export const configuteAxios = (navigate: NavigateFunction) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = token;
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
      return Promise.reject(error);
    }
  );
};
