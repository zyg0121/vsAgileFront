/*
 * @Author: zyg0121 zhouyiguo2012@qq.com
 * @Date: 2024-11-10 19:47:37
 * @LastEditors: zyg0121 zhouyiguo2012@qq.com
 * @LastEditTime: 2024-11-10 19:49:42
 * @FilePath: \vsAgileFront\src\webview\utils\request.js
 * @Description: 
 * 
 * Copyright (c) 2024 by yiguo, All Rights Reserved. 
 */
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://uapis.cn',
    timeout: 10000,
});

instance.interceptors.request.use(
    config => {
        // Add any request interceptors here
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        // Add any response interceptors here
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;