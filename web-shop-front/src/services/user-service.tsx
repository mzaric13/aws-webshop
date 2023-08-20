import axios from "axios";
import { SignUpReturnValue, User, UserCreation } from "../models/User";
import { baseUrl } from "../utils/Util";

export const signUp = (user: UserCreation) => {
  return axios.post<SignUpReturnValue>(`${baseUrl}/user/signup`, user);
};

export const getLoggedUser = () => {
  return axios.get<{ statusCode: number; body: User }>(
    `${baseUrl}/user/get-logged-user`
  );
};
