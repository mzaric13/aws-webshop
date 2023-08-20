export const setToken = (
  idToken: string,
  decodedToken: any,
  accessToken: string
) => {
  localStorage.setItem("idToken", idToken);
  localStorage.setItem("role", decodedToken["custom:role"]);
  localStorage.setItem("accessToken", accessToken);
  if (decodedToken["custom:role"] === "ADMIN") return "/admin-products";
  else return "/products";
};

export const getIdToken = () => {
  return localStorage.getItem("idToken");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const deleteToken = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("role");
  localStorage.removeItem("accessToken");
};
