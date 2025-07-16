import axios from "axios";
import CryptoJS from "crypto-js";
import CYS from "./Secret";
import { logout, SSOlogout } from "./services";

export function createAxiosClient({ options, getCurrentAccessToken }: any) {
  const client = axios.create(options);
  client.interceptors.request.use(
    (config: any) => {
      const token = getCurrentAccessToken();
      if (token) {
        config.headers.Authorization = token;
      }
      if (config.data instanceof FormData) {
        console.log(config.data);
      } else {
        config.data = {
          cypher: CryptoJS.AES.encrypt(
            JSON.stringify(config.data),
            CYS
          ).toString(),
        };
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      if (response.data.data) {
        response.data.data = JSON.parse(
          CryptoJS.AES.decrypt(response.data.data, CYS).toString(
            CryptoJS.enc.Utf8
          )
        );
      }
      return response;
    },
    async (error) => {
      if (error.response.status === 403 || error.response.status === 401) {
        SSOlogout();

        return axios(error.config);
      }
      return Promise.reject(error);
    }
  );
  return client;
}
