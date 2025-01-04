import axios from 'axios'
import * as toast from "../Utils/toastify"


class Endpoints {
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

  async get(endpoint, params = {}, auxFunction = null, admin = false) {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.get(`${this.baseURL}/${endpoint}`, {
        ...config,
        params, // Agrega los parámetros como query string
      });
      if (auxFunction) await auxFunction();
      return response.data.results;
    } catch (error) {
      toast.handleError(error);
      console.error('Error en GET:', error);
    }
  }


  async post(endpoint, data = {}, auxFunction = null, admin = false, message= 'Operación exitosa') {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.post(`${this.baseURL}/${endpoint}`, data, config);
      toast.showSuccess(message);
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      toast.handleError(error);
      console.error('Error en POST:', error);
    }
  }

  async put(endpoint, data = {}, auxFunction = null, admin = false) {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.put(`${this.baseURL}/${endpoint}`, data, config);
      toast.showSuccess('Actualización exitosa');
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      toast.handleError(error);
      console.error('Error en PUT:', error);
    }
  }

  async delete(endpoint, auxFunction = null, admin = false) {
    try {
      const config = admin ? this.setAuthHeader() : {};
      const response = await axios.delete(`${this.baseURL}/${endpoint}`, config);
      toast.showSuccess('Eliminación exitosa');
      if (auxFunction) await auxFunction();
      return response.data;
    } catch (error) {
      toast.handleError(error);
      console.error('Error en DELETE:', error);
    }
  }
}

export default Endpoints;
