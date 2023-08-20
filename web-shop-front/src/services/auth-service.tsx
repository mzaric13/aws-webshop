import axios from "axios";
import { AuthCredentials, LoginCredentials } from "../models/Auth";
import { baseUrl } from "../utils/Util";

export const login = (loginCredentials: LoginCredentials) => {
  return axios.post<{ statusCode: number; body: AuthCredentials }>(
    `${baseUrl}/auth/login`,
    loginCredentials
  );
};

export const logout = () => {
  return axios.get<{ statusCode: number; body: string }>(
    `${baseUrl}/auth/logout`
  );
};
