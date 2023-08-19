import axios from "axios";
import { AuthCredentials, LoginCredentials } from "../models/Auth";
import { baseUrl } from "../utils/Util";
import { deleteToken } from "./token-service";

export const login = (loginCredentials: LoginCredentials) => {
  return axios.post<{ statusCode: number; body: AuthCredentials }>(
    `${baseUrl}/auth/login`,
    loginCredentials
  );
};

export const logout = () => {
  //TODO: axios call
  deleteToken();
};
