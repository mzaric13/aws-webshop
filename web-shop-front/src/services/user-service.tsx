import axios from "axios";
import User, { SignUpReturnValue } from "../models/User";
import { baseUrl } from "../utils/Util";

export const signUp = (user: User) => {
  console.log("usao 1");
  return axios.post<SignUpReturnValue>(`${baseUrl}/user/signup`, user);
};
