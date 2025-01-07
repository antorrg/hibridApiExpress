

let token = '';
let userToken = '';
let userId = '';
let userId2 = '';


export const setToken = (newToken) => {
  token = newToken;
};

export const getToken = () => {
  return token;
};

export const setUserToken = (newToken) => {
  userToken = newToken;
};

export const getUserToken = () => {
  return userToken;
}

export const setUserId = (newid) => {
  userId = newid;
};

export const getUserId = () => {
  return userId;
};

export const setUserId2 = (newid) => {
  userId2 = newid;
};

export const getUserId2 = () => {
  return userId2;
};