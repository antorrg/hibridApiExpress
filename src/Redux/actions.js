import axios from "axios";


export const LANDING = "LANDING";
export const PRODUCT = "PRODUCT";
export const PRODUCT_BY_ID = "PRODUCT_BY_ID";
export const ITEM = "ITEM";
export const CLEAN_STATE = "CLEAN_STATE";
export const ALL_USERS = "ALL_USERS";
export const USER_BY_ID = "USER_BY_ID";
export const MEDIA = 'MEDIA';
export const MEDIA_AD = 'MEDIA_AD';
export const MEDIA_BY_ID = 'MEDIA_BY_ID'
   


export const getInfo = (isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/land",);
      return dispatch({
        type: LANDING,
        payload: data.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};