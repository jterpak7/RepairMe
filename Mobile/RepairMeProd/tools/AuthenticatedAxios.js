import axios from 'axios';
import promise from 'promise';
import {AsyncStorage} from 'react-native';

// Add a request interceptor 
var authenticatedAxios = axios.create();

authenticatedAxios.interceptors.request.use(async config => {

  var accessToken = await AsyncStorage.getItem("AuthToken");
  //if token is found add it to the header
  if (accessToken) {
    config.headers.authorization = accessToken;
  }
  return config;
}, function (error) {
   return promise.reject(error);
});

export default authenticatedAxios;