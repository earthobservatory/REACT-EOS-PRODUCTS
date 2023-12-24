//Gets sets and removes the Auth Token Retrieved from Strapi
//Stores in local storage
import { AUTH_TOKEN } from "./constants";

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
export const handleDownload = (url) => {
  // Implement your download logic here
  window.open(url, "_blank"); // Example: Opens the download URL in a new tab
};
