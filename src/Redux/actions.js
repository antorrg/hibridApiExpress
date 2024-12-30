import axios from "axios";
import { landingGet, productGet } from "./endPoints";

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
   


export const getInfo = () => {
  return async (dispatch) => {
    try {
      const data = await landingGet();
      return dispatch({
        type: LANDING,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getProduct = () => {
  return async (dispatch) => {
    try{
    const data = await productGet()
    return dispatch({
      type: PRODUCT,
      payload: data
    })
  }catch(error){
    console.error(error)
  }
}
}