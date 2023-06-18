import axios from "axios";

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:4000/",
      timeout: 10000, //1000ms = 10s
    });
    this.instance.interceptors.request.use(
      (config) => {
        const access_token = localStorage.access_token;

        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.refreshTokenRequest = null;
    this.instance.interceptors.response.use(
      (config) => {
        return config.data;
      },
      (error) => {
        console.log("Error: ", error);
        if (
          error.response.status === 401 &&
          error.response.data.name === "EXPIRED_ACCESS_TOKEN"
        ) {
          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : refreshToken();
          return this.refreshTokenRequest
            .then((access_token) => {
              error.response.config.headers.Authorization = access_token;
              return this.instance(error.response.config); // call request again and overwrite error config
            })
            .catch((refreshTokenError) => {
              throw refreshTokenError;
            })
            .finally(() => {
              this.refreshTokenRequest = null; // for sencond times when request continuously repeat
            });
        }
        return Promise.reject(error);
      }
    );
  }
  get(url) {
    return this.instance.get(url);
  }
  post(url, body) {
    return this.instance.post(url, body);
  }
}

// Refresh token
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  try {
    const res = await http.post("refresh-token", {
      refresh_token,
    });
    //console.log(res)
    const { access_token } = res.data;
    localStorage.setItem("access_token", access_token);
    console.log("refresh token: ", res.message);
    return access_token;
  } catch (error) {
    localStorage.clear();
    throw error.response;
  }
};
const http = new Http();
export default http;
