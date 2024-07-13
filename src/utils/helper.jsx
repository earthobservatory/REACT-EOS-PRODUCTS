//Gets sets and removes the Auth Token Retrieved from Strapi
//Stores in local storage
import { AUTH_TOKEN } from "./constants";
import moment from "moment";

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

export const textToColorHex = (text) => {
  // Array of pastel colors
  const pastelColors = [
    "#FFCCCC",
    "#FFCC99",
    "#FFCCFF",
    "#CCFFCC",
    "#CCFF99",
    "#CCCCFF",
    "#99CCFF",
    "#99CC99",
    "#FF9999",
    "#FF9966",
    "#FFCC66",
    "#FFCCCC",
    "#CCFF99",
    "#FF99CC",
    "#FF9966",
    "#CCFFCC",
    "#FFCC99",
    "#CCCCFF",
    "#99CCFF",
    "#99CC99",
    "#FFCCFF",
    "#FFCC66",
    "#FF99CC",
    "#FF9966",
    "#CCFFCC",
    "#FFCCCC",
    "#FFCC99",
    "#FFCCFF",
    "#CCFFCC",
    "#CCFF99",
    "#CCCCFF",
    "#99CCFF",
    "#99CC99",
    "#FF9999",
    "#FF9966",
    "#FFCC66",
    "#FFCCCC",
    "#CCFF99",
    "#FF99CC",
    "#FF9966",
    "#CCFFCC",
    "#FFCC99",
    "#CCCCFF",
    "#99CCFF",
    "#99CC99",
    "#FFCCFF",
    "#FFCC66",
    "#FF99CC",
    "#FF9966",
    "#CCFFCC",
    // Add more pastel colors as needed
  ];

  var backgroundColor = "#000000";

  if (text === "Damage Proxy Map") backgroundColor = "#ffbd59";
  else if (text === "Flood Proxy Map") backgroundColor = "#8fd2ff";
  else {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use modulus to select a pastel color from the array
    const colorIndex = Math.abs(hash) % pastelColors.length;

    // Set the selected pastel color as the background
    backgroundColor = pastelColors[colorIndex];

    // Calculate the luminance to determine text color
  }

  const luminance =
    (0.299 * parseInt(backgroundColor.slice(1, 3), 16) +
      0.587 * parseInt(backgroundColor.slice(3, 5), 16) +
      0.114 * parseInt(backgroundColor.slice(5, 7), 16)) /
    255;

  // Set text color based on luminance
  const textColor = luminance > 0.5 ? "#000000" : "#FFFFFF";

  return { backgroundColor, color: textColor };
};

export const formatDate = (inputDate) => {
  const formattedDate = moment(inputDate).format("DD MMMM YYYY");
  return formattedDate;
};

export const capitalizeEachWord = (inputString) => {
  return inputString.replace(/\b\w/g, (match) => match.toUpperCase());
};
