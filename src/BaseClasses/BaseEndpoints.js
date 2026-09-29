import axios from 'axios'
import {showSuccess, handleError} from "../Utils/toastify"


class BaseEndpoints {
  constructor(baseURL, validHeader = false) {
    this.baseURL = baseURL;
    this.validHeader = validHeader;
  }

  setAuthHeader() {
    const token = localStorage.getItem('validToken');
    const config = { 
      headers: {},
      //withCredentials: true
     };
    if (token && this.validHeader) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }

  getUrl(endpoint) {
    if (!endpoint) return this.baseURL;
    return endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
  }

  async get(endpoint, params = {}, auxFunction = null, admin = false) {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.get(this.getUrl(endpoint), {
        ...config,
        params, // Agrega los parámetros como query string
      });
      if (auxFunction) await auxFunction();
      return response.data.results;
    } catch (error) {
      handleError(error);
      //console.error('Error en GET:', error);
    }
  }


  async post(endpoint, data = {}, auxFunction = null, admin = false, rejectFunction = null, message= 'Operación exitosa') {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.post(this.getUrl(endpoint), data, config);
      showSuccess(message);
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      handleError(error);
      if(rejectFunction) await rejectFunction()
      //console.error('Error en POST:', error);
    }
  }

  async put(endpoint, data = {}, auxFunction = null, admin = false, rejectFunction= null, message = 'Actualización exitosa') {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.put(this.getUrl(endpoint), data, config);
      showSuccess(message);
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      handleError(error);
      if(rejectFunction) await rejectFunction()
      //console.error('Error en PUT:', error);
    }
  }

  async patch(endpoint, data = {}, auxFunction = null, admin = false, rejectFunction= null, message = 'Actualización exitosa') {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.patch(this.getUrl(endpoint), data, config);
      if (message) showSuccess(message);
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      handleError(error);
      if(rejectFunction) await rejectFunction();
    }
  }

  async delete(endpoint, auxFunction = null, admin = false, rejectFunction= null, message= 'Eliminación exitosa') {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.delete(this.getUrl(endpoint), config);
      showSuccess(message);
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      handleError(error);
      if(rejectFunction) await rejectFunction()
      //console.error('Error en DELETE:', error);
    }
  }
}

export default BaseEndpoints;
