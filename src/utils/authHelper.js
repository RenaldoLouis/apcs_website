// Auth Token Helper
export const getUserAuthToken = () => localStorage.getItem("key");

export const setUserAuthToken = (authToken) => {
  localStorage.setItem("key", authToken);
};

export const removeUserAuthToken = () => {
  localStorage.removeItem("key");
};