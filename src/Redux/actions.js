import { landingGet, productGet, landingGetById, productGetById, getItemById, userGet, userGetbyid } from "./endPoints";
import { handleError } from "../Utils/toastify";

export const LANDING = "LANDING";
export const LANDING_BY_ID = 'LANDING_BY_ID';
export const PRODUCT = "PRODUCT";
export const PRODUCT_BY_ID = "PRODUCT_BY_ID";
export const ITEM = "ITEM";
export const ALL_USERS = "ALL_USERS";
export const USER_BY_ID = "USER_BY_ID";
export const CLEAN_STATE = "CLEAN_STATE";
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
      handleError(error);
    }
  };
};

export const getInfoById = (id) => {
  return async (dispatch) =>{
    try {
      const data = await landingGetById(id)
      return dispatch({
        type : LANDING_BY_ID,
        payload: data,
      })
    } catch (error) {
      handleError(error)
    }
  }
}

export const getProduct = () => {
  return async (dispatch) => {
    try{
    const data = await productGet()
    return dispatch({
      type: PRODUCT,
      payload: data
    })
  }catch(error){
   handleError(error)
  }
}
}
export const getProductById = (id) => {
  return async (dispatch) =>{
    try {
      const data = await productGetById(id)
      return dispatch({
        type : PRODUCT_BY_ID,
        payload: data,
      })
    } catch (error) {
      handleError(error)
    }
  }
}

export const getItem = (id) => {
  return async (dispatch) =>{
    try {
      const data = await getItemById(id)
      return dispatch({
        type : ITEM,
        payload: data,
      })
    } catch (error) {
      handleError(error)
    }
  }
}

export const getUsers = () => {
  return async (dispatch) => {
    try{
    const data = await userGet()
    return dispatch({
      type: ALL_USERS,
      payload: data
    })
  }catch(error){
   handleError(error)
  }
}
}
export const getUserById = (id) => {
  return async (dispatch) =>{
    try {
      const data = await userGetbyid(id)
      return dispatch({
        type : USER_BY_ID,
        payload: data,
      })
    } catch (error) {
      handleError(error)
    }

  }
}

export const cleanState = () =>{
  return ({
    type : CLEAN_STATE,
    payload: []
  })
}