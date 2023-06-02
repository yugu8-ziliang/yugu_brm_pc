import axios from "axios";
import qs from "qs";
import store from "@/store";
import router from "@/router";
import { Notification, MessageBox, Message } from "element-ui";

import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
});
let StatusiS = true;

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
      // config.headers["token"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.status || res.data.stauts || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];

    if (code == 401 && StatusiS == true) {
      StatusiS = false;
      MessageBox.confirm(
        "登录状态已过期，您可以继续留在该页面，或者重新登录",
        "系统提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // location.href = "/index";
        store.dispatch("user/logout");
        // location.reload();
        router.push({
          path: "/login",
        });
      });
      setTimeout(() => {
        StatusiS = true;
      }, 3000);
      return Promise.reject(new Error(msg));
    } else {
      if (code === 500 && StatusiS == true) {
        StatusiS = false;
        Message({
          message: msg,
          type: "error",
        });
        setTimeout(() => {
          StatusiS = true;
        }, 3000);
        return Promise.reject(new Error(msg));
      } else if (
        code !== 200 &&
        code !== 100001 &&
        code !== -9 &&
        code !== 201 &&
        StatusiS == true
      ) {
        StatusiS = false;
        Message({
          message: msg,
          type: "warning",
        });
        setTimeout(() => {
          StatusiS = true;
        }, 3000);
        return Promise.reject("error");
      } else {
        return res.data;
      }
    }
  },
  (error) => {
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

/**
 * 封装请求
 * @param type
 * @param url
 * @param data
 * @returns {Promise}
 */
export default function server({ type: type, url: url, data: data }) {
  let params = data || {};
  let Config = {
    method: type,
    url: url,
    params: type === "get" || type === "delete" ? params : null,
    data: type === "post" || type === "put" ? params : null,
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: "repeat",
      }),
    headers: {},
  };
  if (type == "post" || type == "put") {
    Config.headers["Content-Type"] = "application/json";
  }
  return new Promise((resolve, reject) => {
    instance(Config).then(
      (response) => {
        resolve(response || {});
      },
      (err) => {
        console.log(err);
        reject(err);
      }
    );
  });
}
