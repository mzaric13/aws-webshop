export const setToken = (token: string, decodedToken: any) => {
  localStorage.setItem("jwt", token);
  localStorage.setItem("role", decodedToken["custom:role"]);
  if (decodedToken["custom:role"] === "ADMIN") return "/admin-products";
  else return "/products";
};

export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const deleteToken = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("role");
};
